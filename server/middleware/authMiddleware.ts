import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    user?: { _id: string };
}

export const tokenRequired = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({ msg: "Token non presente" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, 'KG2s3J@d32bjk4Hf4');    
        (req as any).user = decoded; 
    } catch (e) {
        res.status(401).send({ msg: "Il tuo token non è formalmente valido" });
        return;
    }
    next();
};
