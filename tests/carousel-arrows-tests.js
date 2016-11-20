'use strict';
var sinon = require('sinon');
import CarouselArrows from '../src/carousel-arrows';
var assert = require('assert');

describe('Carousel Arrows', function () {

    it('should add disabled css class to both left and right arrows when disable() is called', function () {
        var fixture = document.getElementById('qunit-fixture');
        var disabledClass = 'arrow-out-of-service';
        var leftArrow = document.createElement('div');
        var rightArrow = document.createElement('div');
        var arrowsView = new CarouselArrows({
            leftArrow: leftArrow,
            rightArrow: rightArrow,
            arrowDisabledClass: disabledClass
        });
        assert.ok(!leftArrow.classList.contains(disabledClass), 'left arrow doesnt yet contain disabled class because disable() hasn\'t been called');
        assert.ok(!rightArrow.classList.contains(disabledClass), 'right arrow doesnt yet contain disabled class because disable() hasn\'t been called');
        arrowsView.disable();
        assert.ok(leftArrow.classList.contains(disabledClass), 'after disable() is called, left arrow contains disabled class');
        assert.ok(rightArrow.classList.contains(disabledClass), 'right arrow contains disabled class');
        arrowsView.destroy();
    });

    it('should add remove disabled css class from both left and right arrows when enable() is called', function () {
        var fixture = document.getElementById('qunit-fixture');
        var disabledClass = 'arrow-out-of-service';
        var leftArrow = document.createElement('div');
        var rightArrow = document.createElement('div');
        var arrowsView = new CarouselArrows({
            leftArrow: leftArrow,
            rightArrow: rightArrow,
            arrowDisabledClass: disabledClass
        });
        arrowsView.disable();
        arrowsView.enable();
        assert.ok(!leftArrow.classList.contains(disabledClass), 'left arrow no longer has disabled class');
        assert.ok(!rightArrow.classList.contains(disabledClass), 'right arrow no longer has disabled class');
        arrowsView.destroy();
    });

    it('should add disabled css class to left arrow when disableLeftArrow() is called', function () {
        var fixture = document.getElementById('qunit-fixture');
        var disabledClass = 'arrow-out-of-service';
        var leftArrow = document.createElement('div');
        var arrowsView = new CarouselArrows({
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        assert.ok(!leftArrow.classList.contains(disabledClass), 'left arrow doesnt yet contain disabled class because disable() hasn\'t been called');
        arrowsView.disableLeftArrow();
        assert.ok(leftArrow.classList.contains(disabledClass), 'after disableLeftArrow() is called, left arrow contains disabled class');
        arrowsView.destroy();
    });

    it('should remove disabled css class to right arrow when enableLeftArrow() is called', function () {
        var fixture = document.getElementById('qunit-fixture');
        var disabledClass = 'arrow-out-of-service';
        var leftArrow = document.createElement('div');
        var arrowsView = new CarouselArrows({
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        arrowsView.disableLeftArrow();
        arrowsView.enableLeftArrow();
        assert.ok(!leftArrow.classList.contains(disabledClass));
        arrowsView.destroy();
    });

    it('should add disabled css class to right arrow when disableRightArrow() is called', function () {
        var fixture = document.getElementById('qunit-fixture');
        var disabledClass = 'arrow-out-of-service';
        var rightArrow = document.createElement('div');
        var arrowsView = new CarouselArrows({
            rightArrow: rightArrow,
            arrowDisabledClass: disabledClass
        });
        assert.ok(!rightArrow.classList.contains(disabledClass), 'right arrow doesnt yet contain disabled class because disable() hasn\'t been called');
        arrowsView.disableRightArrow();
        assert.ok(rightArrow.classList.contains(disabledClass), 'after disableRightArrow() is called, left arrow contains disabled class');
        arrowsView.destroy();
    });

    it('should remove disabled css class to right arrow when enableRightArrow() is called', function () {
        var fixture = document.getElementById('qunit-fixture');
        var disabledClass = 'arrow-out-of-service';
        var rightArrow = document.createElement('div');
        var arrowsView = new CarouselArrows({
            rightArrow: rightArrow,
            arrowDisabledClass: disabledClass
        });
        arrowsView.disableRightArrow();
        arrowsView.enableRightArrow();
        assert.ok(!rightArrow.classList.contains(disabledClass));
        arrowsView.destroy();
    });

    it('should call onRightArrowClick callback when right arrow is clicked', function () {
        var fixture = document.getElementById('qunit-fixture');
        var rightArrow = document.createElement('div');
        var rightArrowClickSpy = sinon.spy();
        var arrowsView = new CarouselArrows({
            rightArrow: rightArrow,
            onRightArrowClick: rightArrowClickSpy
        });
        assert.equal(rightArrowClickSpy.callCount, 0);
        rightArrow.click();
        assert.equal(rightArrowClickSpy.callCount, 1);
        arrowsView.destroy();
    });

    it('should NOT trigger onRightArrowClick callback when right arrow is clicked after destruction', function () {
        var fixture = document.getElementById('qunit-fixture');
        var rightArrow = document.createElement('div');
        var rightArrowClickSpy = sinon.spy();
        var arrowsView = new CarouselArrows({
            rightArrow: rightArrow,
            onRightArrowClick: rightArrowClickSpy
        });
        arrowsView.destroy();
        rightArrow.click();
        assert.equal(rightArrowClickSpy.callCount, 0);
    });
    
    it('should NOT call onRightArrowClick callback when a disabled right arrow is clicked', function () {
        var fixture = document.getElementById('qunit-fixture');
        var rightArrow = document.createElement('div');
        var rightArrowClickSpy = sinon.spy();
        var arrowsView = new CarouselArrows({
            rightArrow: rightArrow,
            onRightArrowClick: rightArrowClickSpy
        });
        arrowsView.disableRightArrow();
        rightArrow.click();
        assert.equal(rightArrowClickSpy.callCount, 0);
        arrowsView.destroy();
    });
    
    it('should call onLeftArrowClick callback when left arrow is clicked', function () {
        var fixture = document.getElementById('qunit-fixture');
        var leftArrow = document.createElement('div');
        var leftArrowClickSpy = sinon.spy();
        var arrowsView = new CarouselArrows({
            leftArrow: leftArrow,
            onLeftArrowClick: leftArrowClickSpy
        });
        assert.equal(leftArrowClickSpy.callCount, 0);
        leftArrow.click();
        assert.equal(leftArrowClickSpy.callCount, 1);
        arrowsView.destroy();
    });
    
    it('should NOT trigger onLeftArrowClick callback when left arrow is clicked after destruction', function () {
        var fixture = document.getElementById('qunit-fixture');
        var leftArrow = document.createElement('div');
        var leftArrowClickSpy = sinon.spy();
        var arrowsView = new CarouselArrows({
            leftArrow: leftArrow,
            onLeftArrowClick: leftArrowClickSpy
        });
        arrowsView.destroy();
        leftArrow.click();
        assert.equal(leftArrowClickSpy.callCount, 0);
    });
    
    it('should add disabled css class on left arrow when update() is called on first panel index', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML =
            '<div>Panel 1</div>' +
            '<div>Panel 2</div>' +
            '<div>Panel 3</div>';
        var leftArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        // go to first panel
        arrowsView.update(0);
        assert.ok(leftArrow.classList.contains(disabledClass));
        arrowsView.destroy();
    });
    
    it('should add disabled css class on right arrow when update() is called on last panel index', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML =
            '<div>Panel 1</div>' +
            '<div>Panel 2</div>' +
            '<div>Panel 3</div>';
        var rightArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            rightArrow: rightArrow,
            arrowDisabledClass: disabledClass
        });
        // go to last panel
        arrowsView.update(panelEls.length - 1);
        assert.ok(rightArrow.classList.contains(disabledClass));
        arrowsView.destroy();
    });
    
    it('should NOT add disabled css class to left arrow when update() is called on last panel index when there are more panels', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML =
            '<div>Panel 1</div>' +
            '<div>Panel 2</div>' +
            '<div>Panel 3</div>';
        var leftArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        // go to last panel
        arrowsView.update(panelEls.length - 1);
        assert.ok(!leftArrow.classList.contains(disabledClass));
        arrowsView.destroy();
    });
    
    it('should NOT add disabled css class to right arrow when update() is called on first panel index when there are more panels', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML =
            '<div>Panel 1</div>' +
            '<div>Panel 2</div>' +
            '<div>Panel 3</div>';
        var rightArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            rightArrow: rightArrow,
            arrowDisabledClass: disabledClass
        });
        // go to first panel
        arrowsView.update(0);
        assert.ok(!rightArrow.classList.contains(disabledClass));
        arrowsView.destroy();
    });
    
    it('should add disabled css class to both left and right arrows when update() is called on the only panel that exists', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML = '<div>Panel 1</div>';
        var rightArrow = document.createElement('div');
        var leftArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            rightArrow: rightArrow,
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        // go to first panel
        arrowsView.update(0);
        assert.ok(leftArrow.classList.contains(disabledClass), 'left arrow is disabled');
        assert.ok(rightArrow.classList.contains(disabledClass), 'right arrow is disabled');
        arrowsView.destroy();
    });
    
    it('should remove disabled css class from left arrow after updating to second panel', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML =
            '<div>Panel 1</div>' +
            '<div>Panel 2</div>' +
            '<div>Panel 3</div>';
        var rightArrow = document.createElement('div');
        var leftArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            rightArrow: rightArrow,
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        // go to first panel
        arrowsView.update(0);
        // go to second panel
        arrowsView.update(1);
        assert.ok(!leftArrow.classList.contains(disabledClass), 'left arrow is no longer disabled');
        arrowsView.destroy();
    });
    
    it('should remove disabled css class from right arrow after updating to second panel after last panel', function () {
        var fixture = document.getElementById('qunit-fixture');
        var panelsContainer = document.createElement('div');
        var disabledClass = 'arrow-out-of-service';
        panelsContainer.innerHTML =
            '<div>Panel 1</div>' +
            '<div>Panel 2</div>' +
            '<div>Panel 3</div>';
        var rightArrow = document.createElement('div');
        var leftArrow = document.createElement('div');
        var panelEls = panelsContainer.getElementsByTagName('div');
        var arrowsView = new CarouselArrows({
            panels: panelEls,
            rightArrow: rightArrow,
            leftArrow: leftArrow,
            arrowDisabledClass: disabledClass
        });
        // go to last panel
        arrowsView.update(2);
        // go to second panel
        arrowsView.update(1);
        assert.ok(!rightArrow.classList.contains(disabledClass), 'right arrow is no longer disabled');
        arrowsView.destroy();
    });


});
