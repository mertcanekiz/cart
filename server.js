import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import uuidv1 from 'uuid/v1';

import Product, { Color } from './models/Product';

// Definitions
const PORT = 8080;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/cart';

// Create express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established');
});

// Routes
const productRoutes = express.Router();
app.use('/products', productRoutes);

productRoutes.route('/').get((req, res) => {
  Product.find((err, products) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(products);
    }
  });
});

productRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    res.json(product);
  });
});

productRoutes.route('/add').post((req, res) => {
  let product = new Product({
    title: req.body.title,
    description: req.body.description,
    productType: req.body.productType,
    imageURL: req.body.imageURL,
    colors: req.body.colors,
  });
  console.log(product);
  product
    .save()
    .then(product => {
      res.status(200).json({ id: product._id, success: true });
    })
    .catch(err => {
      res.status(400).send('Adding new product failed');
    });
});

productRoutes.route('/delete/:id').post((req, res) => {
  let id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    res.status(200).json({
      id: product._id,
      deleted: true,
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
