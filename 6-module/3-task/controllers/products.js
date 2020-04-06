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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;
  const products = query
    ? (await Product.find({ $text: { $search: query } })).map(transform)
    : [];

  ctx.body = { products };
};
