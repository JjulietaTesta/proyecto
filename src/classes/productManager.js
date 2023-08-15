import ProductsModel from "../dao/models/products.js";

const getProducts = async () => {
  const response = await ProductsModel.find()
  return response
}

const getProductsById = async (id) => {
  const response = await ProductsModel.findById(id)
  return response
}

const addProduct = async (product) => {
  await ProductsModel.create(product)
  return product
}

const updateProduct = async (id, product) => {
  await ProductsModel.findByIdAndUpdate(id, product)
  return product
}

const deleteProduct = async (id) => {
  const response = await ProductsModel.findByIdAndDelete(id)
  return response
}


export {getProducts, getProductsById, addProduct, updateProduct, deleteProduct}