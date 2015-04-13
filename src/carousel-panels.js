'use strict';
var _ = require('underscore');
var ElementKit = require('element-kit');
/**
 * A callback function that fires after a new active panel is set
 * @callback CarouselPanels~onChange
 * @param {Number} index - The index of the new panel
 */

/**
 * Adds functionality for carousel panels. Not really meant to be used own its own, unless you want
 * to customize the the javascript logic for the "panels" of the Carousel (assuming that you actually
 * know what you're doing when you do so).
 * @constructor CarouselPanels
 * @param {object} options - Options passed into instance
 * @param {HTMLCollection} options.panels - The panels in which to use for the carousel (an array of photos)
 * @param {string} [options.assetClass] - The CSS class of the asset images inside of the DOM
 * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
 * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
 * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
 * @param {CarouselPanels~onChange} [options.onChange] - When the current panel is changed
 * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
 */
var CarouselPanels = function (options) {
    this.initialize(options);
};

CarouselPanels.prototype = {

    /**
     * When the carousel is instantiated.
     */
    initialize: function (options) {

        this.options = _.extend({
            panels: [],
            assetClass: null,
            assetLoadingClass: 'carousel-asset-loading',
            autoLoadAssets: true,
            panelActiveClass: 'carousel-panel-active',
            onChange: null,
            lazyLoadAttr: 'data-src'
        }, options);

        this._checkForInitErrors();
    },

    /**
     * Checks for errors upon initialize.
     * @memberOf CarouselPanels
     * @private
     */
    _checkForInitErrors: function () {
        var options = this.options,
            panelCount = options.panels.length;
        if (!panelCount) {
            console.error('carousel error: no panels were passed in constructor');
        }
    },

    /**
     * Transitions to a panel of an index.
     * @param {Number} index - The index number to go to
     * @memberOf CarouselPanels
     */
    goTo: function (index) {

        var maxIndex = this.options.panels.length - 1,
            minIndex = 0,
            prevIndex = this.getCurrentIndex();

        if (index > maxIndex || index < minIndex) {
            console.error('carousel panel error: unable to transition to an index of ' + index + 'which does not exist!');
        }

        if (prevIndex === undefined || prevIndex !== index) {

            this._updatePanels(index);

            this._currentIndex = index;

            if (this.options.onChange) {
                this.options.onChange(index)
            }
        }
    },

    /**
     * Makes all panels inactive except for the one at the index provided.
     * @param {Number} index - The new index
     * @memberOf CarouselPanels
     * @private
     */
    _updatePanels: function (index) {
        var panels = this.options.panels,
            prevIndex = this.getCurrentIndex();
        if (prevIndex !== undefined) {
            panels[prevIndex].kit.classList.remove(this.options.panelActiveClass);
        }
        panels[index].kit.classList.add(this.options.panelActiveClass);
        if (this.options.autoLoadAssets) {
            this.loadPanelAssets(index);
        }
    },

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     * @memberOf CarouselPanels
     */
    getCurrentIndex: function () {
        return this._currentIndex;
    },

    /**
     * Loads assets for a given panel.
     * @param {Number} index - The index of the panel containing the assets to load
     * @memberOf CarouselPanels
     */
    loadPanelAssets: function (index) {
        var panel = this.options.panels[index],
            assets = this.options.assetClass ? panel.getElementsByClassName(this.options.assetClass) : [panel],
            i,
            count = assets.length,
            el;
        for (i = 0; i < count; i++) {
            el = assets[i];
            if (el.getAttribute(this.options.lazyLoadAttr)) {
                if (el.tagName.toLowerCase() === 'img') {
                    this._loadImageAsset(el);
                } else {
                    console.warn('carousel error: no matching img elements to lazy load. try supplying a valid assetClass option to constructor');
                }
            }
        }
    },

    /**
     * Manually lazy loads a resource using an element's data attribute.
     * @param {HTMLElement} el - The image element to load
     * @param {Function} [callback] - A function that fires when the asset is done loading
     * @private
     * @memberOf CarouselPanels
     */
    _loadImageAsset: function (el, callback) {
        var img = el || new Image(),
            src = el.getAttribute(this.options.lazyLoadAttr),
            loadingClass = this.options.assetLoadingClass;
        img.kit.classList.add(loadingClass);
        img.onload = function() {
            img.kit.classList.remove(loadingClass);
            callback ? callback() : null;
        };
        img.src = src;
    },

    /**
     * Final cleanup of instance.
     * @memberOf CarouselPanels
     */
    destroy: function () {
        var options = this.options;
        options.panels[this.getCurrentIndex()].kit.classList.remove(options.panelActiveClass);
        this._currentIndex = null;
    }
};

module.exports = CarouselPanels;