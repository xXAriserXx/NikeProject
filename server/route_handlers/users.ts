import express, { Request, Response } from "express";
import { carts, users } from "../db";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { secretKey } from "../app";

const router = express.Router();

const encrypt = (word: string) => {
    return createHash('sha256').update(word).digest("hex")
}


router.post("/register", async (req, res) => {
    try {
        const existingUser = await users.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).send({ msg: `Email '${req.body.email}' già registrata` });
            return 
        }
        const user = await users.insertOne({
            name: req.body.name,
            role: "user",
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            password: encrypt(req.body.password),
        });
        const cart = await carts.insertOne({
            userId: String(user.insertedId),
            shoes: []
        })
        res.send({
            msg: `Utente ${user.insertedId} creato, anche il suo carrello e' stato creato ${cart.insertedId}`
        });
    }
    catch (e) {
        if (e.code === 11000) {
            res.status(400).send({ msg: `Email '${req.body.email}' già registrata` });
        }
        else {
            res.status(500).send({ msg: "Impossibile creare l'utente" });
        }
    }
});



router.post("/login", async (req, res) => {
    try {
        const user = await users.findOne(
            {
                email: req.body.email,
                password: encrypt(req.body.password)
            }, 
            { 
                projection: { password: 0 } // non seleziono la password
            }
        )
        if(!user){
            res.status(401).send({ msg: "Email o password errati" })
        }
        else {
            const token = jwt.sign(user, secretKey, { expiresIn: '24h' })
            res.send({ access_token: token })
        }
    }
    catch {

    }
})


router.get("/", async (req, res) => {
    const excludeId = new ObjectId(String(req.query.excludeId))
    try {
        const r = await users.find(
            { _id: { $ne: excludeId } }
        ).toArray();

        res.send({
            usersIds : r
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            esito: false,
            msg: "Something is wrong with the server"
        });
    }
});


export const usersWs = router