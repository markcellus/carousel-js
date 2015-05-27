[![Build Status](https://travis-ci.org/mkay581/carousel-js.svg?branch=master)](https://travis-ci.org/mkay581/carousel-js)

# Carousel

A lightweight and flexible Carousel class that allows you to build fully functional, advanced Carousels with minimal javascript and markup.
This library is built using native vanilla javascript. Which means super fast performance. Supports IE10+, all major browsers and even mobile.

## Usage

Create a carousel based off of a set of predetermined markup. Assuming, you have your html in the DOM and CSS
set up correctly. You can do:

```javascript
var carousel = new Carousel({
    panels: document.getElementsByClassName('carousel-panel'),
    thumbnails: document.getElementsByClassName('carousel-thumbnail')
});

carousel.goTo(1); // go to second carousel item
```

More details and example can be found [here](examples/carousel.html).