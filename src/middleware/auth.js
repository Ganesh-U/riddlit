// Middleware to check if user is logged in
export function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(401).json({ error: "Login required" });
  }
  next();
}
