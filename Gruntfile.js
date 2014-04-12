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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('default', 'watch:dev');

};
