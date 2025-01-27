import express from "express"


const router = express.Router()

router.get("/", async(req, res) => {
    console.log("received")
    res.send("hello")
})

export const favoritesTs = router