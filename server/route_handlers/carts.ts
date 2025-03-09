
import express from "express" //imports the express module
import { carts } from "../db" //imports the carts collection from the db module    
import { CustomRequest, tokenRequired } from "../middleware/authMiddleware" //imports the CustomRequest and tokenRequired from the authMiddleware module

const router = express() //creates a router using the express module

router.get("/quantity", tokenRequired, async (req:CustomRequest, res) => { //creates a get request to the /quantity endpoint that requires a token
    const user = req.user._id //creates a constant variable user that is assigned the value of the user id from the request

    try {
    const cart = await carts.findOne({ //creates a constant variable cart that is assigned the value of the cart document with the user id
        userId: user 
    })

    if (!cart) {
        res.status(404).send({ msg: "Cart not found" }) //sends a 404 status and a message that says "Cart not found"
    }
        res.json(cart.shoes.length) //sends a json response with the length of the shoes array
    }
    catch (error) { 
    res.status(500).send({ msg: "Internal server error", error: error}) //sends a 500 status and a message that says "Internal server error"
    }
})

router.get("/:id", tokenRequired, async (req, res) => { //creates a get request to the /:id endpoint that requires a token
    try {
        const userId = req.params.id //creates a constant variable userId that is assigned the value of the id parameter from the request
        const userCart = await carts.findOne(
            { userId: userId }
        )
        if (!userCart) {
            res.status(404).send({ msg: "Cart not found" })
        } 
        res.send(userCart)}
    catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error})
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