module.exports = {
    cache: function(req, res, next) {
        res.set('Cache-Control', 'public, max-age=3600');
        next();
    }

};
