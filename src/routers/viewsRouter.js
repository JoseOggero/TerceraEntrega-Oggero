const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

router.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  try {
    const count = await Product.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .limit(limit)
      .skip(skip);

    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ status: 'error' });
  }
});

router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid).populate('products');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json(cart.products);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ status: 'error' });
  }
});

// Importar el repositorio de Tickets
const TicketRepository = require('../repositories/TicketRepository');

router.get('/carts/:cid/purchase', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid).populate('products');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productsToPurchase = [];

    for (const product of cart.products) {
      const availableStock = await Product.getAvailableStock(product._id);
      if (availableStock >= product.quantity) {
        productsToPurchase.push(product);
      }
    }

    const totalAmount = productsToPurchase.reduce((total, product) => total + (product.price * product.quantity), 0);
    const ticket = await TicketRepository.createTicket(cart.purchaser, totalAmount, productsToPurchase);

    const productsNotPurchased = cart.products.filter(product => !productsToPurchase.includes(product));
    cart.products = productsNotPurchased;
    await cart.save();

    res.json({ status: 'success', ticket });
  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    res.status(500).json({ status: 'error' });
  }
});


module.exports = router;