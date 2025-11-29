// Simple rate limit stub - replace with real implementation (express-rate-limit or Redis)
function rateLimit(req, res, next) {
  // TODO: Implement token bucket or use express-rate-limit.
  next();
}

module.exports = { rateLimit };
