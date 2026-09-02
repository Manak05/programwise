// Catches errors passed via next(err) or thrown in async route handlers
// (see utils/asyncHandler.js) and returns a clean JSON response without
// leaking internal database/stack details to the client.
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server.';

  // MySQL duplicate entry (e.g. duplicate email, duplicate save)
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'This record already exists.';
  }

  // MySQL foreign key constraint failures -> invalid reference id
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    statusCode = 400;
    message = 'Invalid reference: related record does not exist.';
  }

  res.status(statusCode).json({ message });
}

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
