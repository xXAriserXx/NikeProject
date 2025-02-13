
import express from "express"
import { carts } from "../db"
import { CustomRequest, tokenRequired } from "../middleware/authMiddleware"

const router = express()

router.get("/quantity", tokenRequired, async (req:CustomRequest, res) => {
    const user = req.user._id

    try {
    const cart = await carts.findOne({
        userId: user
    })

    const length = cart.shoes.length
    console.log(cart.shoes)
    console.log(length)
        res.json(length)
    }
    catch (err) {
    console.log("cawabunga2")
    res.status(500).send({ msg: "Internal server error", err: err})
    }
})

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


router.patch("/update-quantity", tokenRequired, async (req:CustomRequest, res) => {
    try {
        const { action, shoe } = req.body
        const userId = req.user._id

        if (action === "add") {
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
        }
        
        if (action === "remove") {
            await carts.updateOne(
                { userId: userId },
                {
                    $pull: {
                        shoes: {
                            shoeId: shoe.shoeId,
                            color: shoe.color,
                            size: shoe.size
                        }
                    }
                }
            );

            const updatedCart = await carts.findOne({ userId: userId });
            res.status(200).send({
                msg: "Shoe removed from cart successfully",
                cart: updatedCart
            });
        }

        if (action === "increase") {
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

            const updatedCart = await carts.findOne({ userId: userId });
            res.status(200).send({
                msg: "Shoe quantity increased successfully",
                cart: updatedCart
            });
        }

        if (action === "decrease") {
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

            const shoeItem = cart.shoes.find(
                s => s.shoeId === shoe.shoeId && 
                s.color === shoe.color && 
                s.size === shoe.size
            );

            if (shoeItem && shoeItem.quantity <= 1) {
                await carts.updateOne(
                    { userId: userId },
                    {
                        $pull: {
                            shoes: {
                                shoeId: shoe.shoeId,
                                color: shoe.color,
                                size: shoe.size
                            }
                        }
                    }
                );
            } else {
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
                    { $inc: { "shoes.$.quantity": -1 } }
                );
            }

            const updatedCart = await carts.findOne({ userId: userId });
            res.status(200).send({
                msg: "Shoe quantity decreased successfully",
                cart: updatedCart
            });
        }

    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
});

router.patch("/empty", tokenRequired, async (req:CustomRequest, res) => {
    try {
        const userId = req.user._id
        const cartToEmpty = carts.updateOne(
            { userId: userId },
            { $set: { shoes: []}}
        )
        res.send({ msg: "it worked bro", cartToEmpty })
    } 
    catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }

})


export const cartWs = router