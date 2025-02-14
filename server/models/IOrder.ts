import { IShoeCart } from "./IShoeCart";

export interface IOrder {
    userId: string,
    orderDate: Date,
    status: string
    orderItems: IShoeCart[]     
    finalPrice?: number
    discountApplied?: number
}