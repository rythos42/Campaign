/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                'Gruntfile.js',
                'js/app/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            },
        },
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'ftp.geeksong.com',
                    port: 21,
                    authKey: 'key1'
                },
                src: '.',
                dest: 'public_html/Campaign',
                exclusions: [
                '.gitignore', 
                '.jshintrc', 
                '.travis.yml', 
                'Gruntfile.js', 
                'notes.txt', 
                'package.json', 
                'README.md', 
                '.ftppass', 
                'LICENSE',
                'node_modules', 
                '.git', 
                'settings.php',
                'Database Diagram Draw.io.png',
                'Database Diagram Draw.io.xml',
                'HOW TO TRAVIS ENCRYPT.txt',
                'install.txt',
                'settings.sample.php',
                'db',
                'img/*.pdn'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ftp-deploy');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('deploy', ['create-ftp-file', 'ftp-deploy']);
    
    grunt.registerTask('create-ftp-file', 'Create an authentication file for FTP', function() {
        var ftpUsername = grunt.option('ftpUsername'),
            ftpPassword = grunt.option('ftpPassword');      
        
        var contents = '{"key1":{"username":"' + ftpUsername + '", "password":"' + ftpPassword + '"}}';
            
        // Create a file to supply the authentication parameters to the deployment
        grunt.file.write('.ftppass', contents);
    });
};