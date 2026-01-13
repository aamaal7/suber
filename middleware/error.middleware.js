const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    if (err.name === "CastError") {
      error.statusCode = 404;
      const message = "Resource not found";
      error = new Error(message);
    } else if (err.code === 11000) {
      error.statusCode = 400;
      const message = "Duplicate field value error";
      error = new Error(message);
    } else if (err.name === "ValidationError") {
      error.statusCode = 400;
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
    }
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
