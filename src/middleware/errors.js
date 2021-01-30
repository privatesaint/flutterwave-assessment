const joiErrors = (error) =>
  error.details.map((detail) => detail.message).join(",");

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Handling Joi Validation Error
  if (err.details) {
    const errors = joiErrors(err);
    return res.status(400).json({
      message: errors,
      status: "error",
      data: null,
    });
  }
  // handle invalid payload
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  }
  let error = { ...err };
  error.message = err.message;
  res.status(error.statusCode).json({
    message: error.message || "Internal Server Error.",
    status: "error",
    data: null,
  });
};
