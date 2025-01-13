import { MongoClient } from "mongodb";
import { IShoe } from "./models/IShoe";
import { IUser } from "./models/IUser";
import { ICart } from "./models/ICart";
import { IOrder } from "./models/IOrder";

const client = new MongoClient("mongodb+srv://jrprecilla365:v4pLRrF9PdIhISjx@nike-project-db.xpt5e.mongodb.net/?retryWrites=true&w=majority&appName=nike-project-db")
const db = client.db("nikeDB")

export const shoes = db.collection<IShoe>("shoes")
export const users = db.collection<IUser>("users")
export const carts = db.collection<ICart>("carts")
export const orders = db.collection<IOrder>("orders")