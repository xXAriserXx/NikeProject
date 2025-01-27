import bodyParser from "body-parser"
import express from "express"
import cors from "cors"
import { shoesWs } from "./route_handlers/shoes"
import { usersWs } from "./route_handlers/users"
import { ordersWs } from "./route_handlers/orders"
import { cartWs } from "./route_handlers/carts"
import { favoritesTs } from "./route_handlers/favorites"

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use("/shoes", shoesWs)
app.use("/users", usersWs)
app.use("/orders", ordersWs)
app.use("/carts", cartWs)
app.use("/favorites", favoritesTs)

export const secretKey:string = "KGJH324234@sdfkbj"

app.listen(3000, () => {console.log("Backend started, listening on port 3000")})


