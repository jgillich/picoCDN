var crypto      = require('crypto'),
    fs          = require('fs'),
    _           = require('underscore'),
    hbs         = require('hbs'),
    hljs        = require('highlight.js'),
    plugins     = require('./plugins.js');

module.exports = {

    index: function (req, res) {
        res.render('index', {});
    },

    submit: function (req, res, next) {
        var text = req.body.text,
            hash,
            file;

        if(typeof text !== 'string' || text.length <= 0) {
            res.statusCode = 400;
            return next(new Error('Text can not be empty.'));
        }

        text = text.replace(/\r\n/g, '\n');

        hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        hash.write(text);
        hash.end();

        file = hash.read().slice(0, 10);
        fs.writeFile('files/' + file, text, function (err) {
            if(err) {
                return res.send(500);
            }

            res.redirect('/' + file);
        });
    },

    file: function (req, res, next) {
        fs.readFile('files/' + req.params[0], { encoding: 'utf8' }, function(err, text) {
            if(err) {
                res.statusCode = 404;
                return next(new Error('File not found.'));
            }

            var enabledPlugins = [],
                env = {
                    hbs: hbs,
                    raw: false,
                    escape: true,
                    contentType: 'text/plain',
                    language: hljs.highlightAuto(text).language
                };

            switch(env.language) {
                case 'javascript':
                    env.contentType = 'application/javascript';
                    break;
                case 'css':
                    env.contentType = 'text/css';
                    break;
            }

            if(typeof req.params[1] === 'string') {
                enabledPlugins = req.params[1].split(',');
            }

            enabledPlugins.forEach(function(key) {
                if(plugins[env.language] && plugins[env.language][key]) {
                    try {
                        text = plugins[env.language][key].call(env, text);
                    } catch (ex) {
                        console.error(ex);
                        return next(new Error('Plugin failed to run: ' + key + '.'));
                    }
                } else if(key === 'raw') {
                    env.raw = true;
                }
            });

            if(env.raw) {
                res.set('Content-Type', env.contentType + '; charset=utf-8');
                res.send(text);
            } else {
                if(env.escape && env.language !== undefined) {
                    text = hljs.highlight(env.language, text).value;
                } else if(env.escape) {
                    text = _.escape(text);
                }

                res.render('file', { text: text, language: env.language || 'text', enabledPlugins: enabledPlugins });
            }
        });

    },

    style: function (req, res) {
        res.header('Content-Type', 'text/css');
        res.send(req.app.get('style'));
    },

    notFound: function(req, res, next) {
        res.statusCode = 404;
        next(new Error('Not found.'));
    },

    error: function(err, req, res, next){
        console.error(err.stack);
        res.render('error', { message: err.message || 'Unknown error' });
    },

    about: function (req, res) {
        res.render('about', {});
    }

};
