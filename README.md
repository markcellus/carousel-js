[![Build Status](https://travis-ci.org/mkay581/carousel-js.svg?branch=master)](https://travis-ci.org/mkay581/carousel-js)
[![npm version](https://badge.fury.io/js/carousel-js.svg)](https://badge.fury.io/js/carousel-js)

# Carousel

A lightweight and flexible Carousel class that allows you to build fully functional, advanced Carousels with minimal javascript and markup.
This library is built using native vanilla javascript (for performance) and adheres to latest ECMAScript specs.
Supports IE10+, all major browsers and even mobile.

## Inspiration

This is a module that I built originally to solve many of the headaches and complexities around building flexible
and scalable carousels.

This library has been used and adopted on many projects, including:

* [fallout4.com](http://www.fallout4.com)
* [mobile USPS.com](http://m.usps.com)
* [barclaycardus.com](http://barclaycardus.com)

## Installation

You can install as an npm package if using a build system like [Browserify](http://browserify.org/). 

```
npm install carousel-js --save-dev
```

## Usage

### Carousel

You can create a carousel based off of a set of predetermined markup. Assuming you have the appropriate elements
already in the DOM and have your CSS set up correctly to show and hide the styles. You can setup Carousel
and navigate to panels programmatically.

```javascript
var carousel = new Carousel({
    panels: document.getElementsByClassName('carousel-panel')
});

carousel.goTo(1); // go to second carousel panel
```

### Carousel with Clickable Thumbnails

Create a carousel with thumbnails based off of a set of predetermined markup. Assuming, you have your html in the DOM and CSS
set up correctly. You can use the Carousel class to add interactivity:

```javascript
var thumbnails = document.getElementsByClassName('carousel-thumbnail');

var carousel = new Carousel({
    panels: document.getElementsByClassName('carousel-panel'),
    thumbnails: thumbnails
});

// click on second thumbnail to show second panel
thumbnails[1].click();
```

More details and example can be found [here](examples/carousel-with-thumbnails.html).

### Carousel Image Lazy Loading

The carousel class also allows lazy loading images so that you can ensure that large image assets
only load when transitioning to the panel they reside in. This saves us from hogging the user's bandwidth and downloading
all image assets before a user navigates to it.
To use the lazy loading functionality, let's assume you have the following in the DOM already:

```html
<div class="carousel-panel">
    <img data-lazy-src="http://www.gstatic.com/webp/gallery/1.jpg" src="" />
</div>
<div class="carousel-panel">
    <img data-lazy-src="http://www.gstatic.com/webp/gallery/2.jpg" src="" />
</div>
```

Then you can do this:

```javascript
var carousel = new Carousel({
    panels: document.getElementsByClassName('carousel-panel'),
    panelActiveClass: 'carousel-panel-active',
    lazyLoadAttr: 'data-lazy-src',
    assetLoadingClass: 'image-loading'
});

// go to second panel and lazy load the image it contains
carousel.goTo(1);

```

A more in-depth, working example of Carousel's lazy loading can be found [here](examples/carousel-image-lazy-loading.html).

### Carousel with Arrows

You can easily create a carousel with the traditional left and right arrows. Assuming you have the following markup
and styles in the DOM, you can do something like this:


```javascript
var leftArrowElement = document.getElementsByClassName('carousel-left-arrow')[0];
var rightArrowElement = document.getElementsByClassName('carousel-right-arrow')[0];

var carousel = new Carousel({
    panels: document.getElementsByClassName('carousel-panel'),
    leftArrow: leftArrowElement,
    rightArrow: rightArrowElement,
    arrowDisabledClass: 'arrow-disabled'
});

// go to first panel which will add a css class on the left arrow to disable it
carousel.goTo(0);

// click right arrow to navigate to next panel
// which will remove the disabled css class from the left arrow
rightArrowElement.click();

```
