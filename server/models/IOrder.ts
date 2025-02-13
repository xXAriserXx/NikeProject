import { IShoeCart } from "./IShoeCart";

export interface IOrder {
    userId: string,
    orderDate: Date,
    status: string
    orderItems: IShoeCart[]     
    discountApplied?: number
    total?: number
}