const path = require('path');
const Koa = require('koa');
const app = new Koa();

let subscribers = [];

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await (new Promise((resolve) => subscribers.push(resolve)));
  ctx.status = 200;
  next();
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (message) {
    subscribers.forEach((subscriber) => subscriber(message));
    subscribers = [];
    ctx.status = 200;
  }
  next();
});

app.use(router.routes());

module.exports = app;
