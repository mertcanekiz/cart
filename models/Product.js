import mongoose, { Schema, SchemaTypes } from 'mongoose';

const productSchema = new Schema({
  title: String,
  description: String,
  imageURL: String,
  productType: String,
  colors: [SchemaTypes.Mixed],
  created_at: Date,
});

const colorSchema = new Schema({
  rgb: String,
  name: String,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
export const Color = mongoose.model('Color', colorSchema);
