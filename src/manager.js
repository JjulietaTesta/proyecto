import { ProductManager } from "./classes/productManager";
import { __dirname } from "./utils.js";

let myFirstStore = new ProductManager("/products.json");
myFirstStore.getProducts().then((data) => console.log (data))