// middleware.js

export function notFoundError(req, res, next) {
  const error = new Error('Not Found');
  error.status = 404; // Correct status code for "Not Found"
  res.status(error.status).json({
    message: 'Not Found',
  });
  // No need to call next() here, as the response is already sent
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  res.status(status).json({
    error: {
      message,
    },
  });
}
