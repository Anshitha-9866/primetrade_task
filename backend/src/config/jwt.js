module.exports = {
  secret: process.env.JWT_SECRET ||'QJc1aR6RnhOOG9SY1qb0RFEKrM5Vv8vA1/vj5d09KoY=',
  expiresIn: process.env.JWT_EXPIRE || '7d',
};
