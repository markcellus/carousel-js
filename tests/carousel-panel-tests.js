"use strict";
var sinon = require('sinon');
import CarouselPanel from '../src/carousel-panel';
var assert = require('assert');
var defer = require('lodash.defer');
var Promise = require('promise');
// must import module in order to operate off of prototype
import Module from 'module-js';

describe('Carousel Panel', function () {

    it('should load the src set on the lazy loading attribute designated in configuration on load() call', function () {
        var image = document.createElement('img');
        var testSrc = 'blank.jpg';
        image.setAttribute('data-test-src', testSrc);
        var panel = new CarouselPanel(image, {lazyLoadAttr: 'data-test-src'});
        panel.load();
        image.onload(); // trigger onload immediately
        assert.ok(image.src, testSrc, 'correct src is set');
        panel.destroy();
    });

    it('should add loading class to image element initially and remove when done loading', function (done) {
        var image = document.createElement('img');
        var imageSrc = 'path/to/image.jpg';
        var lazyLoadAttr = 'd-src';
        image.setAttribute(lazyLoadAttr, imageSrc);
        var imageLoadedClass = 'loaded';
        var panel = new CarouselPanel(image, {
            assetLoadedClass: imageLoadedClass,
            lazyLoadAttr: lazyLoadAttr
        });
        panel.load();
        assert.ok(!image.classList.contains(imageLoadedClass), 'no loading class is added initially');
        image.onload();
        // delay following code until the load()
        // call stack has completed since it is wrapped in a Promise
        defer(function () {
            assert.ok(image.classList.contains(imageLoadedClass), 'once image is loaded, the loaded class is added');
            panel.destroy();
            done();
        });
    });

    it('should resolve load() call when all nested image elements with lazy load attributes are loaded', function (done) {
        var fixture = document.getElementById('qunit-fixture');
        var panelEl = document.createElement('div');
        panelEl.classList.add('carousel-panel');
        var baseUrl = 'http://test2/';
        panelEl.innerHTML =
            '<img class="carousel-item" src="blank.jpg" my-data-src="' + baseUrl + 'c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" my-data-src="' + baseUrl + 'c2.jpg" />';
        var moduleLoadStub = sinon.stub(Module.prototype, 'load').returns(Promise.resolve());
        var panel = new CarouselPanel(panelEl, {lazyLoadAttr: 'my-data-src'});
        var images = panelEl.getElementsByTagName('img');
        var onLoadSpy = sinon.spy();
        panel.load().then(onLoadSpy);
        assert.equal(onLoadSpy.callCount, 0, 'load hasnt resolved initially');
        images[0].onload();
        defer(function () {
            assert.equal(onLoadSpy.callCount, 0, 'load still hasnt resolved after first image load because there is also a second one');
            images[1].onload();
            defer(function () {
                assert.equal(onLoadSpy.callCount, 1, 'load has resolved after final image loads');
                panel.destroy();
                moduleLoadStub.restore();
                done();
            });
        });
    });

});
