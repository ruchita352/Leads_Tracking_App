const { HttpError } = require('../utils/http-error');

function notFound(req, res, next) {
  next(new HttpError(404, 'Page not found'));
}

module.exports = { notFound };
