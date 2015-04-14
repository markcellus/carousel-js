'use strict';
var CarouselPanels = require('./carousel-panels');
var CarouselThumbs = require('./carousel-thumbs');
var ElementKit = require('element-kit');
var utils = ElementKit.utils;
var Module = require('module.js');
/**
 * A callback function that fires after a new active panel is set
 * @callback Carousel~onPanelChange
 * @param {Number} index - The index of the new panel
 */

/**
 * Adds carousel functionality to a set up pre-determined HTML markup.
 * @class Carousel
 * @param {object} options - Options passed into instance
 * @param {HTMLCollection} options.panels - The panels in which to use for the carousel (an array of photos)
 * @param {string} [options.assetClass] - The CSS class of the asset images inside of the DOM
 * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
 * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
 * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
 * @param {Carousel~onPanelChange} [options.onPanelChange] - When the current panel is changed
 * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
 * @param {HTMLCollection} [options.thumbnails] - A collection of elements that are the thumbnails
 * @param {string} [options.thumbnailActiveClass] - The CSS class that gets added to a thumbnail element when it becomes active
 * @param {Number} [options.initialIndex] - The index of the panel to go to upon instantiation (if not declared, goTo() must be called manually).
 */

var Carousel = Module.extend({

    /**
     * Sets up stuff.
     * @param options
     */
    initialize: function (options) {

        this.options = utils.extend({
            panels: [],
            assetClass: null,
            assetLoadingClass: 'carousel-asset-loading',
            autoLoadAssets: true,
            panelActiveClass: 'carousel-panel-active',
            onPanelChange: null,
            lazyLoadAttr: 'data-src',
            thumbnails: [],
            thumbnailActiveTriggerEvent: 'click',
            thumbnailActiveClass: 'carousel-thumbnail-active',
            initialIndex: 0
        }, options);

        this._checkForInitErrors();
        this.setup();
    },

    /**
     * Sets up the carousel instance by adding event listeners to the thumbnails.
     * @memberOf Carousel
     */
    setup: function () {

        this.panels = new CarouselPanels(utils.extend({}, this.options, {
            onChange: this.onPanelChange.bind(this)
        }));

        if (this.options.thumbnails.length) {
            this.thumbnails = new CarouselThumbs(utils.extend({}, this.options, {
                onChange: this.onThumbnailChange.bind(this)
            }));
        }

        if (typeof this.options.initialIndex === 'number') {
            this.goTo(this.options.initialIndex);
        }
    },

    /**
     * Checks for errors upon initialize.
     * @private
     * @memberOf Carousel
     */
    _checkForInitErrors: function () {
        var options = this.options,
            panelCount = options.panels.length,
            thumbnailCount = options.thumbnails.length;
        if (thumbnailCount && thumbnailCount !== panelCount) {
            console.warn('carousel warning: number of thumbnails passed in constructor do not equal the number of panels' + '\n' +
            'panels: ' + panelCount + '\n' +
            'thumbnails: ' + thumbnailCount + '\n');
        }
    },

    /**
     * When a panel index changes.
     * @param {Number} index - The new index
     * @memberOf Carousel
     */
    onPanelChange: function (index) {
        if (this.thumbnails) {
            this.thumbnails.goTo(index);
        }
        if (this.options.onPanelChange) {
            this.options.onPanelChange(index)
        }
    },

    /**
     * When the thumbnail index changes.
     * @param {Number} index - The new index
     * @memberOf Carousel
     */
    onThumbnailChange: function (index) {
        this.goTo(index);
    },

    /**
     * Transition to a new panel and thumbnail.
     * @param {Number} index - The index number to go to
     * @memberOf Carousel
     */
    goTo: function (index) {
        var options = this.options,
            maxIndex = options.panels.length - 1,
            minIndex = 0;

        if (index > maxIndex) {
            // set to first index if too high
            index = minIndex;
        } else if (index < minIndex) {
            // set to last index if too low
            index = maxIndex;
        }

        this.panels.goTo(index);

        if (this.thumbnails) {
            this.thumbnails.goTo(index);
        }
    },

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     * @memberOf Carousel
     */
    getCurrentIndex: function () {
        return this.panels.getCurrentIndex();
    },

    /**
     * Moves carousel to next panel.
     */
    next: function () {
        this.goTo(this.getCurrentIndex() + 1);
    },

    /**
     * Moves to previous carousel panel.
     */
    prev: function () {
        this.goTo(this.getCurrentIndex() - 1);
    },

    /**
     * Destroys the carousel.
     * @memberOf Carousel
     */
    destroy: function () {
        this.panels.destroy();
        if (this.thumbnails) {
            this.thumbnails.destroy();
        }
    }
});

module.exports = Carousel;