'use strict';
module.exports = {
    build: {
        files: {
            'dist/carousel.js': ['src/carousel.js']
        },
        browserifyOptions: {
            standalone: 'Carousel',
        },
        minifyFiles: {
            'dist/carousel-min.js': ['dist/carousel.js']
        },
        bannerFiles: ['dist/*']

    },
    tests: {
        mocha: {
            files: ['tests/*.js']
        }
    }
};
