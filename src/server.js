const express = require('express');
const mongoose = require('mongoose');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');
const UserRepository = require('./repositories/UserRepository');
const cartsRouter = require('./routers/cartsRouter');


const app = express();
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/Segunda-PreEntrega';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);

const authorize = require('./middlewares/authorize');
app.use('/api/carts', authorize);
app.use('/api/products', authorize);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});