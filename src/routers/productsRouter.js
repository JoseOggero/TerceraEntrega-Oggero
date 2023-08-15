const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort === 'desc' ? -1 : 1;
  const query = req.query.query || {};

  try {
    const count = await Product.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort({ price: sort })
      .limit(limit)
      .skip(skip);

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ status: 'error' });
  }
});

module.exports = router;
