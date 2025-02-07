import express from "express"
import { shoes } from "../db"
import { ObjectId, Filter } from "mongodb"
import { IShoe } from "../models/IShoe"
import { IFilterParams } from "../models/IFilterParams"

const router = express.Router()

router.get("/random", async (req, res) => {
    try {
        const randomShoes = await shoes.aggregate([{ $sample: { size: 5 } }]).toArray();
        res.send(randomShoes)
    } 
    catch {
        res.status(500).send("Server error")
    }
})

router.get("/", async (req, res) => {
  try {
    const allShoes = await shoes.find().toArray()
    res.send(allShoes)
  } 
  catch (error) {
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
    .limit(6) 
    .toArray();

    if (foundShoes) {
      res.send(foundShoes);
    }
  } catch (err) {
    res.status(500).send("Internal Server error " + err);
  }
});

router.post("/filter", async (req, res) => {
  const filterParams:IFilterParams = req.body
  const filter:Filter<IShoe> = {}
  if (filterParams.price.length) {
    if () {
      filter.prezzo = 
    }
    if () {
      filter.prezzo = 
    }
    if () {
      filter.prezzo = 
    }

  }
  if (filterParams.color.length) {
    console.log(filterParams.color)
    filter.colori_disponibili = {$in: filterParams.color.map(color => new RegExp(color, 'i')) }
  }
  if (filterParams.category.length) {
    console.log(filterParams.category)
    filter.categoria = {$in: filterParams.category.map(color => new RegExp(color, 'i')) }
  }

  try {
    const filteredShoes = await shoes.find(filter).toArray()
    res.send({
      shoes: filteredShoes,
      msg: "Shoes successfully retrieved"
    })
  }
  catch (e) {
    res.status(500).send(`Internal server error, mongo errorCode${e}`)
  }
})



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