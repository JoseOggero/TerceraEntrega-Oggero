const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.indexOf(pid);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).json({ status: 'error' });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = products;
    await cart.save();

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).json({ status: 'error' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex((product) => product._id.toString() === pid);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto:', error);
    res.status(500).json({ status: 'error' });
  }
});

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    await Cart.findByIdAndUpdate(cid, { products: [] });

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    res.status(500).json({ status: 'error' });
  }
});

module.exports = router;