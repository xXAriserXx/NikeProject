import { IShoeCart } from "./IShoeCart"

export interface IFavorite {
    userId: string,
    favoriteItems: IShoeCart[]
}