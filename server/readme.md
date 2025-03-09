## Server
In this folder I keep all the backend logic of the application

## Run the server
You should type in the terminal "npm start" to start the project.
Alternatively you could you just run the client since this server is currently being hosted on railway.

## Why is the server inside the angular project
When I started this project I didn't know that it was something unusual. It makes the deployment of the project a bit messy, but overall it's not functionally compromising

## How is it structured
server
├── dist
│   └── ... (compiled files)
├── models
│   ├── IShoeCart.ts
│   └── ... (other model files)
├── node_modules
│   └── ... (installed packages)
├── services     
│   ├── check-log.service.ts
│   ├── cart.service.ts
│   ├── user.service.ts
│   └── ... (other service files)
├── route_handlers     
│   ├── carts.ts
│   ├── favorites.ts
│   ├── orders.ts
│   └── ... (other route handlers files)
├── app.ts
├── db.ts
├── package.json
├── tsconfig.json
└── ... (other files)

## models folder 
It simply keeps all the models of the project including the ones used on the front end

## node_modules
Contains all the node_modules necessary for the server to work

## route_handlers 
In this folder all the all the endpoints of the api are managed trough some ts files, each containing the logic to manage each route


## app.ts  
This file sets up the core functionality of the server.  
It initializes Express.js and configures middleware for CORS and JSON parsing.  

## db.ts  
This file establishes the database connection and exports the necessary collections for the route handlers.
