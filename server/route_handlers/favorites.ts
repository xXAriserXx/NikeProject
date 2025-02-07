import express from "express"
import { CustomRequest, tokenRequired } from "../middleware/authMiddleware"
import { favorites } from "../db"

const router = express.Router()

router.get("/", tokenRequired , async(req:CustomRequest, res) => {
    try {
        const userId = req.user._id
        const favoritesFound = await favorites.find({
            userId: userId
        }).toArray()
        res.status(200).send({msg: "Favorites retrieved", favoritesFound})
    }
    catch {
        res.status(500).send({msg:"Internal server error"})
    }

})

router.patch("/", tokenRequired, async (req: CustomRequest, res) => {
    try {
        const favoriteToAdd = req.body.shoeFav;
        const userId = req.user._id;

        const userFavorites = await favorites.findOne({userId: userId})
        console.log(favoriteToAdd)
        console.log(userFavorites.favoriteItems)
        console.log(userFavorites?.favoriteItems.some(favItem => favItem.shoeId === favoriteToAdd.shoeId))

        if (userFavorites?.favoriteItems.some(favItem => favItem.shoeId == favoriteToAdd.shoeId)) {
            res.status(400).send({ msg: "Already added to your favorites"})
            return
        }

        const favorite = await favorites.updateOne(
            { userId: userId },
            { $push: { favoriteItems: favoriteToAdd } }
        );

        res.status(200).send({ message: "Favorite added successfully"});
    } catch (err) {
        res.status(500).send({ message: "Error adding favorite", code: err});
    }
});



router.patch("/remove", tokenRequired, async (req: CustomRequest, res) => {
    try {
        const favoriteToRemove = req.body.favorite;
        const userId = req.user._id;
        const favorite = await favorites.updateOne(
            { userId: userId },
            { $pull: { favoriteItems: favoriteToRemove } }
        );
        res.status(200).send({ message: "Favorite removed successfully"});
    } catch (err) {
        res.status(500).send({ message: "Error removing favorite" });
    }
});


export const favoritesTs = router