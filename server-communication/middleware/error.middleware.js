function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const response = { message: err.message || "Server Error" };
  if (process.env.NODE_ENV === "development") response.stack = err.stack;
  res.status(status).json(response);
}

module.exports = { errorHandler };
