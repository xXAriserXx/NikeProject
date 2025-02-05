import { IShoeCart } from "./IShoeCart"

export interface ICart {
    userId:string
    shoes: IShoeCart[]
}