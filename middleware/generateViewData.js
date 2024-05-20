const { User } = require('../models');

const generateViewData = async (req, res, next) => {
    if (req.session.userId) {
        const viewPackage = {};
        
        const user = await User.findOne({ where: { id: req.session.userId } });
        const { userName, email } = user
        const userData = { userID: user.id, userName, email };
        viewPackage['user'] = userData;

        if(typeof req.csrfToken != 'undefined') {
            viewPackage['csrfToken'] = req.csrfToken();
        }

        req.viewPackage = viewPackage;
    }
    next();
}

module.exports = generateViewData;