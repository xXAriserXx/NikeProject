import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export const tokenRequired = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({ msg: "Token non presente" })
        return
    }
    const token = authHeader.slice(7)
    try {
        jwt.verify(token, 'KGJH324234@sdfkbj') // just check validity
    } catch (e) {
        res.status(401).send({ msg: "Il tuo token non è formalmente valido" })
        return
    }
    next()
}
