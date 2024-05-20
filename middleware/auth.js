const isAuthenticated = async (req, res, next) => {
    if (req.session.userId) {
        if (req.path === '/login') {
            let redirectUrl = typeof req.query.redirect != 'undefined' ? decodeURIComponent(req.query.redirect) : '/';
            console.log(redirectUrl);
            return res.redirect(redirectUrl);
        }
        return next();
    }
    // Not authenticated and not login path
    if (req.path !== '/login') {
        let redirectUrl = req.originalUrl == '/' ? '/' : '?redirect=' + encodeURIComponent(req.originalUrl);
        return res.redirect('/login' + redirectUrl);
    }
    next();
}

module.exports = { isAuthenticated };