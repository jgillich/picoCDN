var express     = require('express'),
    hbs         = require('hbs'),
    sass        = require('node-sass'),
    bourbon     = require('node-bourbon').includePaths,
    neat        = require('node-neat').includePaths,
    routes      = require('./routes'),
    plugins     = require('./plugins'),
    middlewares = require('./middlewares'),
    app         = express();

app.use(express.compress());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/static', { maxAge: 3600000 }));

app.get('/', middlewares.cache, routes.index);
app.post('/submit', routes.submit);
app.get('/about', middlewares.cache, routes.about);
app.get(/^\/(\w{10})\/?(.*)$/, middlewares.cache, routes.file);
app.get('/style.css', middlewares.cache, routes.style);
app.all('*', routes.notFound);
app.use(routes.error);

sass.render({
    file: 'style.scss',
    success: function (css) {
        app.set('style', css);
    },
    error: function(error) {
        console.error(error);
    },
    includePaths: bourbon.concat(neat)
});

hbs.registerHelper('plugins', function(language, enabledPlugins) {
    var res = '';
    if(plugins[language]) {
        Object.keys(plugins[language]).forEach(function (plugin) {
            res += '<input name="' + plugin + '" type="checkbox"' +
                (enabledPlugins.indexOf(plugin) !== -1 ? ' checked' : '') +'>' + plugin;
        });
    }
    return new hbs.SafeString(res + '<input name="raw" type="checkbox">raw<button>View</button>');
});
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.engine('hbs', hbs.__express);

module.exports = app;
