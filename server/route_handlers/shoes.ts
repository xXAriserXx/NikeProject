import express from "express"
import { shoes } from "../db"
import { ObjectId } from "mongodb"

const router = express()

router.get("/", async (req, res) => {
    try {
        const allShoes = await shoes.find().toArray()
        res.send(allShoes)
    } 
    catch {
        res.status(500).send("Server error")
    }
})

router.get("/newArrivals", async (req, res) => {
  try {
    const foundShoes = await shoes.find(
      { nuovo_arrivi: true }
    ).toArray()
    res.send(foundShoes);
  } catch (err) {
    res.status(500).send('Error removing ID field');
  }
})

router.get("/bestSellers", async (req, res) => {
  try {
    const foundShoes = await shoes.find(
      { best_seller: {$gte: 5}  }
    ).toArray()
    res.send(foundShoes);
  } catch (err) {
    res.status(500).send('Error removing ID field');
  }
})

router.get("/byName/:userInput", async (req, res) => {
  const userInput = req.params.userInput;
  try {
    const foundShoes = await shoes.find(
      { nome: { $regex: userInput, $options: "i" } }
    )
    .limit(6) // Limit to 6 items
    .toArray();

    if (foundShoes) {
      res.send(foundShoes);
    }
  } catch (err) {
    res.status(500).send("Internal Server error " + err);
  }
});



router.get("/:id", async (req, res) => {
    try {
        const shoeId = new ObjectId(String(req.params.id))
        const shoe = await shoes.findOne(
            { _id: shoeId }
        )
        res.send(shoe) 
    } 
    catch {
        res.status(500).send("Internal server error")
    }
})

router.patch('/remove-id', async (req, res) => {
  try {
    await shoes.updateMany(
      {},
      { $unset: { id: "" } }
    );
    res.status(200).send('ID field removed from all documents');
  } catch (err) {
    res.status(500).send('Error removing ID field');
  }
});

export const shoesWs = router