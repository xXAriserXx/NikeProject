import { MongoClient } from "mongodb";
import { IShoe } from "./models/IShoe";
import { IUser } from "./models/IUser";
import { ICart } from "./models/ICart";
import { IOrder } from "./models/IOrder";
import { IFavorite } from "./models/IFavorite";

console.log('DB Connection String:', process.env.connectionString);
const client = new MongoClient(process.env.connectionString)
const db = client.db("nikeDB")

export const shoes = db.collection<IShoe>("shoes")
export const users = db.collection<IUser>("users")
export const carts = db.collection<ICart>("carts")
export const orders = db.collection<IOrder>("orders")
export const favorites = db.collection<IFavorite>("favorites")