import express from "express";
import { CustomRequest, tokenRequired } from "../middleware/authMiddleware";
import { orders } from "../db";

const router = express.Router();

router.post("", tokenRequired, async (req: CustomRequest, res) => {
    try {
        const orderToAdd = req.body.order;
        const userId = req.user._id;
        console.log(orderToAdd)

        const order = await orders.insertOne({
            userId: userId,
            orderDate: new Date(),
            status: "In elaborazione",
            orderItems: orderToAdd,
        });

        res.status(201).send({ msg: "Order added successfully", order });
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
});

router.get("", tokenRequired, async(req: CustomRequest, res) => {
    try {
        const userId = req.user._id
        const ordersFound = await orders.find({
            userId: userId
        }).toArray()
        res.status(200).send({ msg: "Orders retrieved", ordersFound })
    }
    catch (error) {
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
})

export const ordersWs = router;
