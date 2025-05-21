import { isHttpError } from 'http-errors';

function errorHandler(error, req, res, next) {
  if (isHttpError(error)) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  res.status(400).json({
    status: 400,
    message: 'Something went wrong',
    error: error.message,
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
  });
}

export { errorHandler, notFoundHandler };