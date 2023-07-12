import utils from "../utils.js";
class CarritoManager {
  static correlativoId = 0;
  static carritos;
  constructor(path) {
    this.carritos = [];
    this.correlativoId = 0;
    this.path = path;
  }

  addCarrito = async () => {
    this.carritos = await this.getCarritos();
    this.carritos.push({
      id: this.carritos.length ? this.carritos.length : 0,
      products: [],
    });

    utils.writeFile(this.path, this.carritos);
  };

  getCarritos = async () => {
    try {
      let data = await utils.readFile(this.path);
      return data?.length > 0 ? data : [];
    } catch (error) {
      console.log(error);
    }
  };

  getCarritosById = async (id) => {
    this.carritos = await this.getCarritos(id);
    const carrito = this.carritos.find((el) => el.id === id);

    if (!carrito || carrito === undefined) {
      let error = new Error("debe ingresar un id de carrito existente");
      error.statusCode = 400;
      throw error;
    }

    return carrito;
  };

  getIndexProductFromCarrito = async (carrito, idProduct) => {
    if (carrito.products) {
      const productIndex = carrito.products.findIndex(
        (el) => el.id === idProduct
      );
      return productIndex;
    }
    return -1;
  };
  addProductToCarrito = async (id, idProduct) => {
    this.carritos = await this.getCarritos();
    let carrito = await this.getCarritosById(id);

    if (!carrito) {
      let error = new Error("no existe carrito");
      error.statusCode = 400;
      throw error;
    }
    const carritoIndex = this.carritos.findIndex(
      (carrito) => carrito.id === id
    );

    const productIndex = await this.getIndexProductFromCarrito(
      carrito,
      idProduct
    );

    productIndex !== -1
      ? this.carritos[carritoIndex].products[productIndex].quantity++
      : this.carritos[carritoIndex].products.push({
          id: idProduct,
          quantity: 1,
        });

    utils.writeFile(this.path, this.carritos);
  };
}

export default CarritoManager;