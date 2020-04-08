const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  const { user } = ctx;
  try {
    const order = await Order.create({ product, phone, address, user });

    await sendMail({
      template: 'order-confirmation',
      locals: { id: order._id, product },
      to: user.email,
      subject: 'Подтверждение заказа',
    });

    ctx.body = { order: order._id };
  } catch (e) {
    if (e.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {
        errors: Object.fromEntries(
          Object.entries(e.errors).map(([key, { message }]) => [key, message])
        ),
      };
    }
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const { user } = ctx;
  const orders = await Order.find({ user: user.id }).populate('product');
  ctx.body = {
    orders: orders.map(
      ({
        _id: id,
        phone,
        address,
        product: {
          _id: productId,
          title,
          images,
          category,
          subcategory,
          price,
          description,
        },
      }) => ({
        id,
        user: user.id,
        phone,
        address,
        product: {
          id: productId,
          title,
          images,
          category,
          subcategory,
          price,
          description,
        },
      })
    ),
  };
};
