const authenticated = async(req, res, next) => {
    try {
        if (req.session.name) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch(e) {
        
    }
};

const notAuthenticated = async(req, res, next) => {
    try {
        if (!req.session.name) {
            next();
        } else{
            res.redirect('/home');
        }        
    } catch(e) {
        
    }
};

module.exports = {
    authenticated,
    notAuthenticated
};