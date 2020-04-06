const mongoose = require('mongoose');
const Product = require('../models/Product');

const transform = ({
  _id: id,
  title,
  images,
  category,
  subcategory,
  price,
  description
}) => ({ id, title, images, category, subcategory, price, description });

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const filter = ({ subcategory } = ctx.query);
  ctx.body = { products: (await Product.find(filter)).map(transform) };
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = { products: await Product.find().map(transform) };
};

module.exports.productById = async function productById(ctx, next) {
  const { id } = ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(400);

  const product = await Product.findById(id);
  if (!product) ctx.throw(404);

  ctx.body = { product: transform(product) };
};
