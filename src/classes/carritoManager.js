import cartModel from "../dao/models/carts.js";

const addCart = async () => {
  const newCart = {
    products: [],
  };

  const cartAdded = await cartModel.create(newCart);
  return cartAdded;
};

const getCart = async () => {
  const response = await cartModel.find();
  return response;
};

const getCartById = async (id) => {
  const response = await cartModel.findById(id);
  return response;
};

const addProductToCart = async (cid, pid) => {
  
  const cart = await cartModel.findById(cid);
  
  const productIndex = cart.products.findIndex(
    (product) => product.product === pid
  );
  
  if (productIndex === -1) {
    const newProduct = {
      product: pid,
      quantity: 1,
    };

    cart.products.push(newProduct)
    const response = await cartModel.findByIdAndUpdate(cid, {products: cart.products})
    return response;
  } else {
   
    let newQuantity = cart.products[productIndex].quantity
    newQuantity++;

     // Actualizo el campo 'quantity' del producto existente
    cart.products[productIndex].quantity = newQuantity;
    await cartModel.findByIdAndUpdate(cid, {products: cart.products})
    const response = await cartModel.findById(cid)
    return response;
  }
};

const updateCart = async (cid, cart) => {
  const response = cartModel.findByIdAndUpdate(cid, cart);
  return response;
};

export { addCart, getCart, getCartById, addProductToCart, updateCart };