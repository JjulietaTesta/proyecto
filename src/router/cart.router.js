import express from "express";
import { Router } from "express";
import CarritoManager from "../classes/carritoManager.js";
const router = Router();
const carritosManagerV1 = new CarritoManager("carritos.json");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  try {
    await carritosManagerV1.addCarrito();
    res.json({
      status: "200 ok",
      message: `el carrito se añadio correctamente`,
    });
  } catch (err) {
    res.status(err.statusCode).send(` ${err}`);
  }
});

router.get("/:cid", async (req, res) => {
  const id = Number(req.params.cid);
  try {
    const carrito = await carritosManagerV1.getCarritosById(id);
    res.json({ status: "200 ok", message: carrito });
  } catch (err) {
    res.status(err.statusCode).send(` ${err}`);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const idCarrito = Number(req.params.cid);
  const idProduct = Number(req.params.pid);
  try {
    const carrito = await carritosManagerV1.addProductToCarrito(
      idCarrito,
      idProduct
    );
    res.json({ status: "200 ok", message: carrito });
  } catch (err) {
    res.status(err.statusCode).send(` ${err}`);
  }
});

export default router;