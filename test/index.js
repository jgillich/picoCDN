var assert  = require('assert')
    app     = require('../app'),
    plugins = require('../plugins');

describe('app', function () {
    it('should start app', function (done) {
        app.listen(4422, done);
    });

});

describe('javascript plugins', function () {
    it('should uglify', function (done) {
        assert.equal(plugins.javascript.uglify('function test() {};'), 'function test(){}');
        done();
    });
    it('should beautify', function (done) {
        assert.equal(plugins.javascript.beautify('function test(){};'), 'function test() {};');
        done();
    });
});

describe('scss plugins', function () {
    it('should render', function (done) {
        assert.equal(plugins.scss.render('body { width: 1px + 2px; }'), 'body {\n  width: 3px; }\n');
        done();
    });
});

describe('coffeescript plugins', function () {
    it('should compile', function (done) {
        assert.equal(plugins.coffeescript.compile(' x = 0'), '(function() {\n  var x;\n\n  x = 0;\n\n}).call(this);\n');
        done();
    });
});

describe('markdown plugins', function () {
    it('should render', function (done) {
        assert.equal(plugins.markdown.render('## title'), '<h2 id="title">title</h2>\n');
        done();
    });
});
