// Small helper so controllers can throw a clean HTTP error:
//   throw new ApiError(404, 'Program not found');
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
