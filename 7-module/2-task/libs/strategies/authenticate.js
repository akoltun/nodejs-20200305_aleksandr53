const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  if (!email) return done(null, false, 'Не указан email');

  try {
    const user = await User.findOne({ email });

    if (user) {
      done(null, user);
    } else {
      done(null, await User.create({ email, displayName }));
    }
  } catch (e) {
    done(e);
  }
};
