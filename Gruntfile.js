'use strict';
module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bt: {
            dist: 'dist',
            build: {
                files: {
                    'dist/carousel.js': ['src/carousel.js']
                },
                browserifyOptions: {
                    standalone: 'Carousel'
                },
                minifyFiles: {
                    'dist/carousel-min.js': ['dist/carousel.js']
                },
                bannerFiles: ['dist/*']

            },
            tests: {
                mocha: {
                    src: ['tests/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('build-tools');
};