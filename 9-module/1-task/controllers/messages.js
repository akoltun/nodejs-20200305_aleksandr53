const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = (
    await Message.find({ chat: ctx.user.id }).sort({ date: -1 }).limit(20)
  ).map(({ date, text, _id: id, user }) => ({ date, text, id, user }));

  ctx.body = { messages };
};
