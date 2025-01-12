
import express from "express"
import { carts } from "../db"
import { tokenRequired } from "../middleware/authMiddleware"

const router = express()

router.get("/:id", tokenRequired, async (req, res) => {
    try {
        const userId = req.params.id
        const userCart = await carts.findOne(
            { userId: userId }
        )
        res.send(userCart)
    } 
    catch {
        res.status(500).send({ msg: "Internal server error"})
    }
})

router.patch("/:id", tokenRequired, async (req, res) => {
    try {
        const userId = req.params.id;
        const shoe = req.body.shoe;
        
        const cart = await carts.findOne({
            userId: userId,
            shoes: {
                $elemMatch: {
                    shoeId: shoe.shoeId,
                    color: shoe.color,
                    size: shoe.size
                }
            }
        });

        if (cart) {
            await carts.updateOne(
                {
                    userId: userId,
                    shoes: {
                        $elemMatch: {
                            shoeId: shoe.shoeId,
                            color: shoe.color,
                            size: shoe.size
                        }
                    }
                },
                { $inc: { "shoes.$.quantity": 1 } }
            );
        } else {
            await carts.updateOne(
                { userId: userId },
                { $push: { shoes: { ...shoe, quantity: 1 } } }
            );
        }

        const updatedCart = await carts.findOne({ userId: userId });
        res.status(200).send({ 
            msg: "Shoe updated in cart successfully",
            cart: updatedCart
        });
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
});

router.patch("/addRemove", async (req, res) => {
    
})




export const cartWs = router