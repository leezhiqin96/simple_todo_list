const isAuthenticated = async (req, res, next) => {
    if (req.session.userId) {
        console.log('yay');
        return next();
      }
      res.redirect('/login');
}

module.exports = { isAuthenticated };