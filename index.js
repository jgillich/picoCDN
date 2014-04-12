var app = require('./app');

app.listen(4422);

process.on('exit', function () {
    app.close();
});
