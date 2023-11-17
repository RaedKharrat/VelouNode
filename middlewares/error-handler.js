export function notFoundError(req, res, next) {
    const error = new Error('Not Found');
    error.status = 400;
    res.status(error.status).json({
        message: "notFound",
    });
    next()
}
export function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
  
