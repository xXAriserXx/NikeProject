import express from "express";
import { carts, favorites, users } from "../db";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
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
            _id: undefined,
            name: req.body.name,
            role: "user",
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            password: encrypt(req.body.password),
            date: new Date
        });
        const cart = await carts.insertOne({
            userId: String(user.insertedId),
            shoes: []
        });

        const favorite = await favorites.insertOne({
            userId: String(user.insertedId),
            favoriteItems: []
        })
        res.send({
            msg: `Utente ${user.insertedId} creato, anche il suo carrello e' stato creato ${cart.insertedId} e anche i suoi preferiti`
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
                projection: { password: 0 } 
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


export const usersWs = router