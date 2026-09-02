const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveNumber(value) {
  const n = Number(value);
  return !Number.isNaN(n) && n >= 0;
}

module.exports = { isValidEmail, isNonEmptyString, isPositiveNumber };
