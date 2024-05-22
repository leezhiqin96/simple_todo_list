const isAuthenticated = async (req, res, next) => {
  if (req.session.userId) {
    if (req.path === "/login") {
      let redirectUrl = req.query.redirect ? decodeURIComponent(req.query.redirect) : "/";
      return res.redirect(redirectUrl);
    }
    return next();
  } else {
    // Not authenticated
    if (req.path !== "/login" && req.path !== "/users/check") {
      let redirectUrl = req.originalUrl === "/" ? "/" : "?redirect=" + encodeURIComponent(req.originalUrl);
      return res.redirect("/login" + redirectUrl);
    }
  }
  next();
};

const isAuthorized = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  if (
    req.params.userID &&
    req.params.userID !== req.session.userId.toString()
  ) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  next();
};

module.exports = { isAuthenticated, isAuthorized };
