'use strict';
var utils = require('utils');
var ElementKit = require('element-kit');

/**
 * A callback function that fires after a new active panel is set
 * @callback CarouselThumbs~onChange
 * @param {Number} index - The index of the new panel
 */

/**
 * Adds thumbnails for carousel. Not really meant to be used own its own, unless you
 * want to customize the javascript logic for the "thumbnails" of your Carousel instance (assuming that you actually
 * know what you're doing when you do so).
 * @class CarouselThumbs
 * @param {object} options - Options passed into instance
 * @param {HTMLCollection} [options.thumbnails] - A collection of elements that are the thumbnails
 * @param {string} [options.thumbnailActiveClass] - The CSS class that gets added to a thumbnail element when it becomes active
 * @param {CarouselThumbs~onChange} [options.onChange] - When a new thumbnail becomes active
 */
var CarouselThumbs = function (options) {
    this.initialize(options);
};

CarouselThumbs.prototype = {

    /**
     * When carousel is instantiated.
     * @param options
     * @memberOf CarouselThumbs
     */
    initialize: function (options) {

        this.options = utils.extend({
            thumbnails: [],
            thumbnailActiveTriggerEvent: 'click',
            thumbnailActiveClass: 'carousel-thumbnail-active',
            onChange: null
        }, options);

        this.setup();

    },

    /**
     * Sets up the carousel instance by adding event listeners to the thumbnails.
     * @memberOf CarouselThumbs
     */
    setup: function () {
        var thumbs = this.options.thumbnails;
        if (thumbs.length) {
            utils.triggerHtmlCollectionMethod(thumbs, 'addEventListener', [
                this.options.thumbnailActiveTriggerEvent,
                'onThumbnailEvent',
                this
            ]);
        } else {
            console.error('carousel thumb error: no thumbnails were passed to constructor');
        }
    },

    /**
     * When a thumbnail is clicked.
     * @param {MouseEvent} e - The click event
     * @memberOf CarouselThumbs
     */
    onThumbnailEvent: function (e) {
        if (!this._thumbnailArr) {
            // convert thumbnail HTMLCollection to real array so we can perform necessary array methods
            this._thumbnailArr = Array.prototype.slice.call(this.options.thumbnails);
        }
        var index = this._thumbnailArr.indexOf(e.currentTarget);
        if (index !== -1 && index !== this.getCurrentIndex()) {
            if (this.options.onChange) {
                this.options.onChange(index);
            }
        }
    },

    /**
     * Checks for errors upon initialize.
     * @memberOf CarouselThumbs
     * @private
     */
    _checkForInitErrors: function () {
        var options = this.options,
            thumbnailCount = options.thumbnails.length;
        if (!thumbnailCount) {
            console.error('carousel error: no thumbnails were passed in constructor');
        }
    },

    /**
     * Makes all thumbnails inactive except for the one at the index provided.
     * @param {Number} index - The new index
     * @memberOf CarouselThumbs
     */
    goTo: function (index) {
        var thumbs = this.options.thumbnails,
            prevIndex = this.getCurrentIndex() || 0,
            activeClass = this.options.thumbnailActiveClass,
            maxIndex = thumbs.length - 1,
            minIndex = 0;

        if (index > maxIndex || index < minIndex) {
            console.error('carousel thumbnail error: unable to transition to a thumbnail with an index of ' + index + ', it does not exist!');
        }

        thumbs[index].kit.classList.add(activeClass);

        if (prevIndex !== index) {
            thumbs[prevIndex].kit.classList.remove(activeClass);
        }
        this._currentIndex = index;
    },

    /**
     * Gets the current thumbnail index that is showing.
     * @returns {Number} Returns the index
     * @memberOf CarouselThumbs
     */
    getCurrentIndex: function () {
        return this._currentIndex;
    },

    /**
     * Destroys the instance.
     * @memberOf CarouselThumbs
     */
    destroy: function () {
        var options = this.options,
            thumbs = options.thumbnails;

        this._currentIndex = null;

        if (thumbs.length) {
            utils.triggerHtmlCollectionMethod(thumbs, 'removeEventListener', [
                options.thumbnailActiveTriggerEvent,
                'onThumbnailEvent',
                this
            ]);
        }
    }
};

module.exports = CarouselThumbs;