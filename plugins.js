var uglify      = require('uglify-js'),
    beautify    = require('js-beautify').js_beautify,
    sass        = require('node-sass'),
    coffee      = require('coffee-script'),
    marked      = require('marked'),
    sanitizer   = require('caja-sanitizer');

module.exports = {
    javascript: {
        uglify: function (text) {
            return uglify.minify(text, { fromString: true }).code;
        },
        beautify: function (text) {
            return beautify(text, { indent_size: 4 });
        }
    },
    scss: {
        render: function (text) {
            this.contentType = 'text/css';
            return sass.renderSync({ data: text });
        }
    },
    coffeescript: {
        compile: function (text) {
            this.contentType = 'application/javascript';
            return coffee.compile(text);
        }
    },
    markdown: {
        render: function (text) {
            this.escape = false;
            this.contentType = 'text/html';
            return sanitizer.sanitize(marked(text));
        }
    }
};
