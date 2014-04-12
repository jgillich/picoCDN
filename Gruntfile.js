module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            dev: {
                files: ['*.js', 'views/*.hbs', 'style.scss'],
                tasks: ['express:dev'],
                options: {
                    interrupt: true,
                    atBegin: true,
                    spawn: false
                }
            },
        },
        express: {
            dev: {
                options: {
                    script: './app.js',
                    delay: 100
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            all: ['*.js']
        },

        mochacli: {
            options: {
                ui: 'bdd',
                reporter: 'spec'
            },
            all: ['test/*.js']
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', [
        'jshint',
        'mochacli'
    ]);

    grunt.registerTask('default', 'watch:dev');

};
