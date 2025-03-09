import { NextFunction, Request, Response } from "express"; //imports the NextFunction, Request, and Response interfaces from the express module
import jwt from 'jsonwebtoken'; //imports the jwt module

export interface CustomRequest extends Request { //creates a CustomRequest interface that extends the Request interface
    user?: { _id: string };
}

export const tokenRequired = (req: CustomRequest, res: Response, next: NextFunction) => { //creates a tokenRequired function that takes a CustomRequest, Response, and NextFunction as arguments
    const authHeader = req.header("authorization"); //creates a constant variable authHeader that is assigned the value of the authorization header from the request
    if (!authHeader || !authHeader.startsWith("Bearer ")) { //checks if the authHeader is falsy or does not start with "Bearer "
        res.status(401).send({ msg: "Token not present " }); //sends a 401 status and a message that says "Token non presente"
        return;
    }
    const token = authHeader.slice(7); //creates a constant variable token that is assigned the value of the authHeader starting from the 7th character
    try {
        const decoded = jwt.verify(token, process.env.secretKey) as { _id: string }; //creates a constant variable decoded that is assigned the value of the decoded token using the jwt.verify method with the token and the secret key as arguments
        req.user = decoded; //assigns the decoded value to the user property of the request
    } catch (e) {
        res.status(401).send({ msg: "The token is not valid" }); //sends a 401 status and a message that says "The token is not valid"
        return;
    }
    next(); //calls the next function
};
