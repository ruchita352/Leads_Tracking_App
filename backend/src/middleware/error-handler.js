function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(status).json({
      error: {
        message: status >= 500 ? 'Internal server error' : error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
  }

  return res.status(status).send(status >= 500 ? 'Something went wrong. Please try again.' : error.message);
}

module.exports = { errorHandler };
