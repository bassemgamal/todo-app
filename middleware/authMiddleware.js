const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Token is not valid.",
    });
  }
};
