const Category = require('../models/Category');
const ObjectArrayToStringStream = require('../libs/ObjectArrayToSrtingStream');

const transform = ({ _id: id, title, subcategories }) =>
  JSON.stringify({
    id,
    title,
    subcategories: subcategories.map(({ _id: id, title }) => ({ id, title }))
  });

module.exports.categoryList = async function categoryList(ctx, next) {
  ctx.type = 'json';
  ctx.body = Category.find()
    .cursor({ transform })
    .pipe(
      new ObjectArrayToStringStream({
        prefix: '{"categories":[',
        postfix: ']}'
      })
    );

  // #Sync solution
  // const categories = (await Category.find()).map(transform);
  // ctx.body = { categories };
};
