import { IShoeCart } from "./IShoeCart" //imports the IShoeCart interface from the same directory

export interface ICart { //creates an ICart interface
    userId:string
    shoes: IShoeCart[]
}