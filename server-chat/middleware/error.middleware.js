const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  const response = {
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
