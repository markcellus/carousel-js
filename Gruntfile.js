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
                }
            },
            min: {
                files: {
                    'dist/carousel-min.js': ['dist/carousel.js']
                }
            },
            banner: {
                files: ['dist/*']
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