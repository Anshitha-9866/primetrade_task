const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = { generateToken };
