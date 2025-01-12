/*
    So the cart document looks like that. There is an a user id and then an array that contains all the shoes that that user has 
    saved in his cart.

    So what if the user is logged in?
    If the user is logged in then when he adds a shoe to his cart(which is created once the user registers), said shoe is saved using a patch request.


    So what if the user is not logged in?
    If the user is not logged in then when he adds a shoe to his cart (which would be an object that has two properties: userId which is set to "guest" and shoes which
    will be an empty array) said shoe is pushed to the cart shoes property.
    When the user later logs if there are items in the cart they will be moved to the newly created cart in the db
*/ 

export interface IShoeCart {
    shoeId:string
    shoeName:string
    size:number
    color: string
    quantity: number
}