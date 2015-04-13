var sinon = require('sinon');
var TestUtils = require('test-utils');
var Carousel = require('../src/carousel');
var assert = require('assert');

describe('Carousel', function () {
    var fixture;

    it('should reflect correct index when transitioning through panels', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = sinon.spy();
        var carouselView = new Carousel({
            panels: panels,
            onPanelChange: panelChangeSpy
        });
        assert.equal(carouselView.getCurrentIndex(), 0, 'getCurrentIndex() returns 0 on initialize');
        assert.ok(panels[0].classList.contains(activeClass), 'active class has been applied to first panel');
        assert.equal(panelChangeSpy.callCount, 1, 'onPanelChange callback was fired since init auto-navigates to first panel');
        carouselView.goTo(2); // go to second index
        assert.equal(carouselView.getCurrentIndex(), 2, 'after transitioning to second panel, getCurrentIndex() returns 2');
        assert.ok(panels[2].classList.contains(activeClass), 'active class has been applied to second panel');
        assert.ok(!panels[0].classList.contains(activeClass), 'active class has been removed from first panel');
        assert.deepEqual(panelChangeSpy.args[1], [2], 'onPanelChange callback was fired with the second index as its first argument');
        carouselView.destroy();
    });

    it('should not cause unexpected behavior when trying to transition to a panel that is already showing', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = sinon.spy();
        var panelChangeCallCount = 0;
        var carouselView = new Carousel({
            panels: panels,
            onPanelChange: panelChangeSpy
        });
        panelChangeCallCount++;
        carouselView.goTo(2);
        panelChangeCallCount++;
        assert.deepEqual(panelChangeSpy.args[panelChangeCallCount - 1], [2], 'after transitioning to second panel, onPanelChange callback was fired with the second index as its first argument');
        assert.equal(carouselView.getCurrentIndex(), 2, 'getCurrentIndex() returns 2');
        assert.ok(panels[2].classList.contains(activeClass), 'active class has been applied to second panel');
        carouselView.goTo(2);
        assert.equal(panelChangeSpy.callCount, panelChangeCallCount, 'after going to the second panel again, onPanelChange callback was NOT fired twice');
        assert.equal(carouselView.getCurrentIndex(), 2, 'getCurrentIndex() still returns 2');
        assert.ok(panels[2].classList.contains(activeClass), 'second panel still has active class');
        carouselView.destroy();
    });

    it('should not crash when showing a panel that doesn\'t exists', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = sinon.spy();
        var panelChangeCallCount = 0;
        var carouselView = new Carousel({
            panels: panels,
            onPanelChange: panelChangeSpy
        });
        panelChangeCallCount++;
        carouselView.goTo(2); // go to third panel
        panelChangeCallCount++;
        assert.equal(carouselView.getCurrentIndex(), 2, 'after transitioning to third panel, getCurrentIndex() returns index of third panel');
        assert.ok(panels[2].classList.contains(activeClass), 'active class has been applied to third panel');
        assert.deepEqual(panelChangeSpy.args[panelChangeCallCount - 1], [2], 'onPanelChange callback was fired with the third panel index as its first argument');
        carouselView.goTo(10); // go to panel of a index that is too high
        panelChangeCallCount++;
        var firstPanelIndex = 0;
        assert.equal(carouselView.getCurrentIndex(), firstPanelIndex, 'after transitioning to a panel with an index that is too high, getCurrentIndex() returns index of first panel');
        assert.ok(panels[firstPanelIndex].classList.contains(activeClass), 'active class has been applied to first panel');
        assert.deepEqual(panelChangeSpy.args[panelChangeCallCount - 1], [firstPanelIndex], 'onPanelChange callback was fired with the first panel index as its first argument');
        carouselView.goTo(-3); // go to panel of a index that is too low
        panelChangeCallCount++;
        var lastPanelIndex = panels.length - 1;
        assert.equal(carouselView.getCurrentIndex(), lastPanelIndex, 'after transitioning to a panel with an index that is too low, getCurrentIndex() returns index of last panel');
        assert.ok(panels[lastPanelIndex].classList.contains(activeClass), 'active class has been applied to last panel');
        assert.deepEqual(panelChangeSpy.args[panelChangeCallCount - 1], [lastPanelIndex], 'onPanelChange callback was fired with the last panel index as its first argument');
        carouselView.destroy();
    });

    it('should add and remove classes and lazy load single assets with NO panel', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var baseUrl = 'http://test/';
        carouselEl.innerHTML =
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c2.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c3.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c4.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c5.jpg" />';

        var images = carouselEl.getElementsByTagName('img');
        var imageLoadingClass = 'carousel-asset-loading';
        var carouselView = new Carousel({
            panels: carouselEl.getElementsByTagName('img')
        });
        // test init (image 1)
        assert.ok(images[0].classList.contains(imageLoadingClass), 'after init, loading class was added to first image');
        assert.equal(images[0].src, baseUrl + 'c1.jpg', 'first images\'s src attribute is replaced with the value of its lazy loading attribute');
        images[0].onload();
        assert.ok(!images[0].classList.contains(imageLoadingClass), 'once first asset loads, its loading class is removed');
        // test image 3
        carouselView.goTo(2);
        assert.ok(images[2].classList.contains(imageLoadingClass), 'going to third panel adds loading class');
        assert.equal(images[2].src, baseUrl + 'c3.jpg', 'third panel\'s src attribute is replaced with the value of its lazy loading attribute');
        images[2].onload(); // trigger third image load
        assert.ok(!images[2].classList.contains(imageLoadingClass), 'once third asset loads, the loading class is removed');
        carouselView.destroy();
    });

    it('should lazy load multiple assets contained inside a single panel', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var baseUrl = 'http://test2/';
        carouselEl.innerHTML =
            '<div class="carousel-panel">' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c2.jpg" />' +
            '</div>' +
            '<div class="carousel-panel">' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c3.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c4.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c5.jpg" />' +
            '</div>';

        var carouselView = new Carousel({
            panels: carouselEl.getElementsByClassName('carousel-panel'),
            assetClass: 'carousel-item'
        });
        var imageLoadingClass = 'carousel-asset-loading';
        var images = carouselEl.getElementsByTagName('img');
        // test init (image 1)
        assert.ok(images[0].classList.contains(imageLoadingClass), 'after init, loading class was added to first image');
        assert.ok(images[1].classList.contains(imageLoadingClass), 'loading class was added to second image');
        assert.equal(images[0].src, baseUrl + 'c1.jpg', 'first images\'s src attribute is replaced with the value of its lazy loading attribute');
        assert.equal(images[1].src, baseUrl + 'c2.jpg', 'second images\'s src attribute is replaced with the value of its lazy loading attribute');
        images[0].onload(); // trigger image load
        images[1].onload(); // trigger second image load
        assert.ok(!images[0].classList.contains(imageLoadingClass), 'once first asset loads, its loading class is removed');
        assert.ok(!images[1].classList.contains(imageLoadingClass), 'once second asset loads, its loading class is removed');
        carouselView.destroy();
    });

    it('should add and remove appropriate classes and handle goTo() calls properly when clicking on thumbnails', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var goToSpy = sinon.spy(Carousel.prototype, 'goTo');
        var goToCallCount = 0;
        carouselEl.innerHTML =
            '<div class="carousel-container">' +
            '<img class="carousel-item" src="blank.jpg" data-src="c1.jpg" />' +
            '</div>' +
            '<div class="carousel-container">' +
            '<img class="carousel-item" src="blank.jpg" data-src="c2.jpg" />' +
            '</div>' +
            '<div class="carousel-container">' +
            '<img class="carousel-item" src="blank.jpg" data-src="c3.jpg" />' +
            '</div>' +
            '<div>' +
            '<button>Thumb 1</button>' +
            '<button>Thumb 2</button>' +
            '</div>' +
            '<div>' +
            '<button>Thumb 3</button>' +
            '</div>';
        var thumbActiveClass = 'thumb-active';
        var thumbEls = carouselEl.getElementsByTagName('button');
        var carouselView = new Carousel({
            panels: carouselEl.getElementsByClassName('carousel-container'),
            assetClass: 'carousel-item',
            thumbnails: thumbEls,
            thumbnailActiveClass: thumbActiveClass
        });
        goToCallCount++; // first panel is shown initially
        assert.ok(thumbEls[0].classList.contains(thumbActiveClass), 'on init, first thumb has active class because first panel is automatically shown');
        // click second thumbnail
        thumbEls[1].dispatchEvent(TestUtils.createEvent('click'));
        goToCallCount++;
        assert.ok(thumbEls[1].classList.contains(thumbActiveClass), 'after clicking on second thumbnail, second thumbnail has active class');
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail no longer has active class');
        assert.ok(!thumbEls[2].classList.contains(thumbActiveClass), 'third thumbnail no longer has active class');
        assert.deepEqual(goToSpy.args[goToCallCount - 1], [1], 'goTo was called with index of second panel');
        // click first thumbnail
        thumbEls[0].dispatchEvent(TestUtils.createEvent('click'));
        goToCallCount++;
        assert.ok(thumbEls[0].classList.contains(thumbActiveClass), 'after clicking on first thumbnail, first thumbnail has active class');
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail no longer has active class');
        assert.ok(!thumbEls[2].classList.contains(thumbActiveClass), 'third thumbnail no longer has active class');
        assert.deepEqual(goToSpy.args[goToCallCount - 1], [0], 'goTo was called with index of first panel');
        // click third thumbnail
        thumbEls[2].dispatchEvent(TestUtils.createEvent('click'));
        goToCallCount++;
        assert.ok(thumbEls[2].classList.contains(thumbActiveClass), 'after clicking on third thumbnail, third thumbnail has active class');
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail no longer has active class');
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail no longer has active class');
        assert.deepEqual(goToSpy.args[goToCallCount - 1], [2], 'goTo was called with index of third panel');
        // click on third panel AGAIN
        thumbEls[2].dispatchEvent(TestUtils.createEvent('click'));
        assert.ok(thumbEls[2].classList.contains(thumbActiveClass), 'after clicking on third thumbnail AGAIN, third thumbnail still has active class');
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail does not have active class');
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail does not have active class');
        assert.equal(goToSpy.callCount, goToCallCount, 'goTo was NOT called again because third panel is already active');
        carouselView.destroy();
        goToSpy.restore();
    });

    it('next() should call goTo() with correct parameters', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({panels: panels});
        carouselView.goTo(1); // go to second index
        var goToSpy = sinon.spy(carouselView, 'goTo');
        carouselView.next();
        assert.equal(goToSpy.args[0][0], 2, 'next() calls goTo with third panel index when on second one');
        carouselView.prev();
        assert.equal(goToSpy.args[1][0], 1, 'prev() calls goTo with second panel index when on third one');
        goToSpy.restore();
        carouselView.destroy();
    });

});