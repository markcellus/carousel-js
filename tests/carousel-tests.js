'use strict';
var sinon = require('sinon');
import Carousel from '../src/carousel';
import CarouselArrows from '../src/carousel-arrows';
import CarouselThumbs from '../src/carousel-thumbs';
import CarouselPanels from '../src/carousel-panels';
var assert = require('assert');

describe('Carousel', function () {

    it('should instantiate CarouselPanels with correct options when it is instantiated', function () {
        var carouselEl = document.createElement('div');
        var panel = document.createElement('div');
        carouselEl.appendChild(panel);
        var backClass = 'panel-transition-backwards-yo';
        var forwardClass = 'panel-transition-forward-son';
        var carousel = new Carousel({
            panels: [panel],
            panelBackClass: backClass,
            panelForwardClass: forwardClass
        });
        assert.equal(carousel.subModules.panels.options.panels[0], panel);
        assert.equal(carousel.subModules.panels.options.panels.length, 1);
        assert.equal(carousel.subModules.panels.options.panelBackClass, backClass);
        assert.equal(carousel.subModules.panels.options.panelForwardClass, forwardClass);
        carousel.destroy();
    });

    it('should call CarouselPanels destroy on destroy()', function () {
        var panelsDestroySpy = sinon.spy(CarouselPanels.prototype, 'destroy');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({panels: panels});
        assert.equal(panelsDestroySpy.callCount, 0);
        carouselView.destroy();
        assert.equal(panelsDestroySpy.callCount, 1, 'CarouselPanels destroy was called');
        panelsDestroySpy.restore();
    });

    it('should pass first parameter of goTo() to CarouselPanels.goTo()', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({panels: panels});
        var carouselGoToStub = sinon.stub(carouselView, 'goTo');
        carouselView.goTo(2); // go to second index
        assert.deepEqual(carouselGoToStub.args[0], [2]);
        carouselGoToStub.restore();
        carouselView.destroy();
    });

    it('should remove active class when calling goTo() with an index for any other panel but the current one', function () {
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({panels: panels});
        carouselView.goTo(0); // go to first panel
        carouselView.goTo(2); // go to third panel
        assert.ok(!panels[0].classList.contains(activeClass));
        carouselView.destroy();
    });

    it('should return CarouselPanel\'s getCurrentIndex() of 0 after initialization', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({panels: panels});
        assert.equal(carouselView.getCurrentIndex(), 0);
        carouselView.destroy();
    });

    it('should return CarouselPanel\'s getCurrentIndex() of 1 after switching to second panel', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({panels: panels});
        carouselView.goTo(1);
        assert.equal(carouselView.getCurrentIndex(), 1);
        carouselView.destroy();
    });

    it('should invoke the onPanelChange function with the index passed to goTo()', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = sinon.spy();
        var panelChangeCallCount = 0;
        var carouselView = new Carousel({panels: panels, onPanelChange: panelChangeSpy});
        panelChangeCallCount++;
        // trigger false on change within CarouselPanels instance
        carouselView.subModules.panels.options.onChange(2);
        assert.deepEqual(panelChangeSpy.args[panelChangeCallCount], [2]);
        carouselView.destroy();
    });

    it('should not call goTo on initialize if initialIndex is set to false or null when instantiating', function () {
        var carouselEl = document.createElement('div');
        var panelEl = document.createElement('div');
        carouselEl.appendChild(panelEl);
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselGoToStub = sinon.stub(Carousel.prototype, 'goTo');
        var carouselView = new Carousel({panels: [panelEl], initialIndex: false});
        assert.equal(carouselGoToStub.callCount, 0);
        carouselView.destroy();
        carouselView = new Carousel({panels: [panelEl], initialIndex: null});
        assert.equal(carouselGoToStub.callCount, 0);
        carouselView.destroy();
        carouselGoToStub.restore();
    });

    it('should call goTo() with the initialIndex option that is passed into constructor', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselGoToSpy = sinon.spy(Carousel.prototype, 'goTo');
        var initialPanelNum = 2;
        var carouselView = new Carousel({
            panels: panels,
            initialIndex: initialPanelNum
        });
        assert.equal(carouselGoToSpy.args[0][0], initialPanelNum, 'goTo() was called with initialIndex option passed in');
        carouselView.destroy();
        carouselGoToSpy.restore();
    });

    it('should NOT invoke onPanelChange callback when calling goTo() if already on the panel index', function () {
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = sinon.spy();
        var panelChangeCallCount = 0;
        var carouselView = new Carousel({panels: panels, onPanelChange: panelChangeSpy});
        panelChangeCallCount++;
        carouselView.goTo(2);
        panelChangeCallCount++;
        carouselView.goTo(2);
        assert.equal(panelChangeSpy.callCount, panelChangeCallCount);
        carouselView.destroy();
    });

    it('should not crash when showing a panel that doesn\'t exists', function () {
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

    it('next() should call goTo() with correct parameters', function () {
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

    it('should NOT instantiate CarouselArrows if no left or right arrow is declared in initialize options', function () {
        var carouselArrowsInitializeStub = sinon.stub(CarouselArrows.prototype, 'constructor');
        var carouselArrowsDestroyStub = sinon.stub(CarouselArrows.prototype, 'destroy');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({
            panels: panels
        });
        assert.equal(carouselArrowsInitializeStub.callCount, 0);
        carouselView.destroy();
        carouselArrowsInitializeStub.restore();
        carouselArrowsDestroyStub.restore();
    });

    it('should pass arrow elements and proper options to CarouselArrows', function () {
        var carouselEl = document.createElement('div');
        var panelEl = document.createElement('div');
        carouselEl.appendChild(panelEl);
        var leftArrow = document.createElement('div');
        var rightArrow = document.createElement('div');
        var carouselView = new Carousel({
            panels: [panelEl],
            leftArrow: leftArrow,
            rightArrow: rightArrow
        });
        assert.deepEqual(carouselView.subModules.arrows.options.panels, [panelEl], 'panels were passed to carousel arrows');
        assert.deepEqual(carouselView.subModules.arrows.options.leftArrow, leftArrow, 'left arrow is passed to carousel arrows');
        assert.deepEqual(carouselView.subModules.arrows.options.rightArrow, rightArrow, 'right arrow was passed to carousel arrows');
        carouselView.destroy();
    });

    it('should call destroy on CarouselArrows when destroy() is called', function () {
        var carouselArrowsInitializeSpy = sinon.spy(CarouselArrows.prototype, 'constructor');
        var carouselArrowsDestroySpy = sinon.spy(CarouselArrows.prototype, 'destroy');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var leftArrow = document.createElement('div');
        var rightArrow = document.createElement('div');
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({
            panels: panels,
            leftArrow: leftArrow,
            rightArrow: rightArrow
        });
        carouselView.destroy();
        assert.equal(carouselArrowsDestroySpy.callCount, 1);
        carouselArrowsInitializeSpy.restore();
        carouselArrowsDestroySpy.restore();
    });

    it('should call onLeftArrowClick when left arrow is clicked', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var leftArrow = document.createElement('div');
        var leftArrowClickSpy = sinon.spy();
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({
            panels: panels,
            leftArrow: leftArrow,
            onLeftArrowClick: leftArrowClickSpy
        });
        // go to second panel so that left arrow is enabled
        carouselView.goTo(1);
        var clickEvent = new Event('click');
        leftArrow.dispatchEvent(clickEvent);
        assert.equal(leftArrowClickSpy.args[0][0], clickEvent, 'click callback was called and passed click event');
        carouselView.destroy();
    });

    it('should NOT instantiate CarouselThumbs if null/undefined is passed as thumbnail option', function () {
        var carouselView = new Carousel({thumbnails: null});
        assert.ok(!carouselView.subModules.thumbnails);
        carouselView.destroy();
    });

    it('should NOT instantiate CarouselThumbs if no thumbnail elements are passed', function () {
        var carouselView = new Carousel();
        assert.ok(!carouselView.subModules.thumbnails);
        carouselView.destroy();
    });

    it('should pass thumbnail elements in CarouselThumbs initialize options', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-thumb"></div>' +
            '<div class="carousel-thumb"></div>' +
            '<div class="carousel-thumb"></div>';
        var thumbs = carouselEl.getElementsByClassName('carousel-thumb');
        var carouselView = new Carousel({thumbnails: thumbs});
        assert.deepEqual(carouselView.subModules.thumbnails.options.thumbnails, thumbs);
        carouselView.destroy();
    });

    it('should call CarouselThumbs destroy on destroy()', function () {
        var carouselThumbsDestroySpy = sinon.spy(CarouselThumbs.prototype, 'destroy');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-thumb"></div>' +
            '<div class="carousel-thumb"></div>' +
            '<div class="carousel-thumb"></div>';
        var thumbs = carouselEl.getElementsByClassName('carousel-thumb');
        var carouselView = new Carousel({thumbnails: thumbs});
        assert.equal(carouselThumbsDestroySpy.callCount, 0);
        carouselView.destroy();
        assert.equal(carouselThumbsDestroySpy.callCount, 1, 'CarouselThumbs destroy was called');
        carouselThumbsDestroySpy.restore();
    });


    it('should pass first parameter of goTo() to CarouselThumbs.goTo()', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-thumb"></div>' +
            '<div class="carousel-thumb"></div>' +
            '<div class="carousel-thumb"></div>' +
                // add panels so that we have an even ratio
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var thumbs = carouselEl.getElementsByClassName('carousel-thumb');
        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var carouselView = new Carousel({thumbnails: thumbs, panels: panels});
        var carouselThumbsGoToStub = sinon.stub(CarouselThumbs.prototype, 'goTo');
        var testIndexNum = 1;
        carouselView.goTo(testIndexNum);
        assert.equal(carouselThumbsGoToStub.args[0][0], testIndexNum);
        carouselThumbsGoToStub.restore();
        carouselView.destroy();
    });

});
