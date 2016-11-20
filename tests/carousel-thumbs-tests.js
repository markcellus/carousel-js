var sinon = require('sinon');
var assert = require('assert');
import CarouselThumbs from '../src/carousel-thumbs';

describe('Carousel Thumbs', function () {

    it('should add and remove appropriate classes and handle goTo() calls properly when clicking on thumbnails', function () {
        var fixture = document.getElementById('qunit-fixture');
        var thumbsEl = document.createElement('div');
        thumbsEl.innerHTML =
            '<button>Thumb 1</button>' +
            '<button>Thumb 2</button>' +
            '<button>Thumb 3</button>';
        var goToSpy = sinon.spy(CarouselThumbs.prototype, 'goTo');
        var goToCallCount = 0;
        var thumbActiveClass = 'thumb-active';
        var thumbEls = thumbsEl.getElementsByTagName('button');
        var thumbsView = new CarouselThumbs({
            thumbnails: thumbEls,
            thumbnailActiveClass: thumbActiveClass
        });
        // click second thumbnail
        thumbEls[1].click();
        goToCallCount++;
        assert.ok(thumbEls[1].classList.contains(thumbActiveClass), 'after clicking on second thumbnail, second thumbnail has active class');
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail no longer has active class');
        assert.ok(!thumbEls[2].classList.contains(thumbActiveClass), 'third thumbnail no longer has active class');
        assert.deepEqual(goToSpy.args[goToCallCount - 1], [1], 'goTo was called with index of second panel');
        // click first thumbnail
        thumbEls[0].click();
        goToCallCount++;
        assert.ok(thumbEls[0].classList.contains(thumbActiveClass), 'after clicking on first thumbnail, first thumbnail has active class');
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail no longer has active class');
        assert.ok(!thumbEls[2].classList.contains(thumbActiveClass), 'third thumbnail no longer has active class');
        assert.deepEqual(goToSpy.args[goToCallCount - 1], [0], 'goTo was called with index of first panel');
        // click third thumbnail
        thumbEls[2].click();
        goToCallCount++;
        assert.ok(thumbEls[2].classList.contains(thumbActiveClass), 'after clicking on third thumbnail, third thumbnail has active class');
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail no longer has active class');
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail no longer has active class');
        assert.deepEqual(goToSpy.args[goToCallCount - 1], [2], 'goTo was called with index of third panel');
        // click on third panel AGAIN
        thumbEls[2].click();
        assert.ok(thumbEls[2].classList.contains(thumbActiveClass), 'after clicking on third thumbnail AGAIN, third thumbnail still has active class');
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail does not have active class');
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail does not have active class');
        assert.equal(goToSpy.callCount, goToCallCount, 'goTo was NOT called again because third panel is already active');
        thumbsView.destroy();
        goToSpy.restore();
    });

    it('should NOT add active classes when clicking on thumbnails after destruction', function () {
        var fixture = document.getElementById('qunit-fixture');
        var thumbsEl = document.createElement('div');
        thumbsEl.innerHTML =
            '<button>Thumb 1</button>' +
            '<button>Thumb 2</button>' +
            '<button>Thumb 3</button>';
        var thumbActiveClass = 'thumb-active';
        var thumbEls = thumbsEl.getElementsByTagName('button');
        var thumbsView = new CarouselThumbs({
            thumbnails: thumbEls,
            thumbnailActiveClass: thumbActiveClass
        });
        // destroy immediately
        thumbsView.destroy();
        // click second thumbnail
        thumbEls[1].click();
        assert.ok(!thumbEls[1].classList.contains(thumbActiveClass), 'second thumbnail does not have active class when clicked');
        // click first thumbnail
        thumbEls[0].click();
        assert.ok(!thumbEls[0].classList.contains(thumbActiveClass), 'first thumbnail does not have active class when clicked');
        // click third thumbnail
        thumbEls[2].click();
        assert.ok(!thumbEls[2].classList.contains(thumbActiveClass), 'third thumbnail does not have active class when clicked');
    });

    it('should NOT call goTo method when clicking on thumbnails after destruction', function () {
        var fixture = document.getElementById('qunit-fixture');
        var thumbsEl = document.createElement('div');
        thumbsEl.innerHTML =
            '<button>Thumb 1</button>' +
            '<button>Thumb 2</button>' +
            '<button>Thumb 3</button>';
        var goToSpy = sinon.spy(CarouselThumbs.prototype, 'goTo');
        var thumbActiveClass = 'thumb-active';
        var thumbEls = thumbsEl.getElementsByTagName('button');
        var thumbsView = new CarouselThumbs({
            thumbnails: thumbEls,
            thumbnailActiveClass: thumbActiveClass
        });
        // destroy immediately
        thumbsView.destroy();
        // click second thumbnail
        thumbEls[1].click();
        // click first thumbnail
        thumbEls[0].click();
        // click third thumbnail
        thumbEls[2].click();
        assert.equal(goToSpy.callCount, 0);
        goToSpy.restore();
    });


});
