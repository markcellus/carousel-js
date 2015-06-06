'use strict';
var _ = require('underscore');
var ElementKit = require('element-kit');
var Module = require('module.js');
var Promise = require('promise');

/**
 * A callback function that fires after the left arrow is clicked
 * @callback CarouselArrows~onLeftArrowClick
 */

/**
 * A callback function that fires after the right arrow is clicked
 * @callback CarouselArrows~onRightArrowClick
 */

/**
 * Adds functionality for carousel's left and right arrows.
 * @constructor CarouselArrows
 */
var CarouselArrows = Module.extend({

    /**
     * When the carousel is instantiated.
     * @param {object} options - Options passed into instance
     * @param {HTMLElement} options.leftArrow - The html element to use as the left arrow
     * @param {HTMLElement} options.rightArrow - The html element to use as the right arrow
     * @param {HTMLCollection} options.panels - The carousel panel elements that to be associated with the arrows
     * @param {string} [options.arrowDisabledClass] - The CSS class that gets added to an arrow when it becomes disabled
     * @param {CarouselArrows~onLeftArrowClick} [options.onLeftArrowClick] - When the left arrow is clicked
     * @param {CarouselArrows~onRightArrowClick} [options.onRightArrowClick] - When the right arrow is clicked
     */
    initialize: function (options) {

        this.options = _.extend({
            leftArrow: null,
            rightArrow: null,
            panels: [],
            arrowDisabledClass: 'carousel-arrow-disabled',
            panelActiveClass: 'carousel-panel-active',
            onLeftArrowClick: null,
            onRightArrowClick: null,
            initialIndex: 0
        }, options);

        this._checkForInitErrors();

        Module.prototype.initialize.call(this, this.options);

        this.arrows = [];


        // setup listeners
        if (options.leftArrow) {
            this.arrows.push(options.leftArrow);
            options.leftArrow.kit.addEventListener('click', 'onLeftArrowClick', this);
        }

        if (options.rightArrow) {
            this.arrows.push(options.rightArrow);
            options.rightArrow.kit.addEventListener('click', 'onRightArrowClick', this);
        }
    },

    /**
     * Checks for errors upon initialize.
     * @memberOf CarouselArrows
     * @private
     */
    _checkForInitErrors: function () {
        var options = this.options;
        if (!options.leftArrow && !options.rightArrow) {
            console.error('Carousel Arrows Error: no left and right arrows were passed into constructor');
        }
    },

    /**
     * Updates the arrow based on the supplied panel index.
     * @param {Number} panelIndex - The new panel index
     */
    update: function (panelIndex) {
        var currentItemNum = panelIndex + 1,
            maxItems = this.options.panels.length,
            minItems = 1;

        if (currentItemNum < maxItems && currentItemNum > minItems) {
            // not on first or last item
            this.enable();
        } else if (currentItemNum === maxItems && currentItemNum === minItems) {
            // on the only panel available
            this.disable();
        } else if (currentItemNum === maxItems) {
            // on last item
            this.disableRightArrow();
            this.enableLeftArrow();
        } else if (currentItemNum === minItems) {
            // on first item
            this.disableLeftArrow();
            this.enableRightArrow();
        }

    },

    /**
     * Disables all arrows
     */
    disable: function () {
        this.disableLeftArrow();
        this.disableRightArrow();
    },

    /**
     * Disables left arrow.
     */
    disableLeftArrow: function () {
        if (this.options.leftArrow) {
            this.options.leftArrow.classList.add(this.options.arrowDisabledClass);
        }
    },

    /**
     * Disables right arrow.
     */
    disableRightArrow: function () {
        if (this.options.rightArrow) {
            this.options.rightArrow.classList.add(this.options.arrowDisabledClass);
        }
    },

    /**
     * Re-enables all arrows.
     */
    enable: function () {
        this.enableLeftArrow();
        this.enableRightArrow();
    },

    /**
     * Re-enables left arrow.
     */
    enableLeftArrow: function () {
        if (this.options.leftArrow) {
            this.options.leftArrow.classList.remove(this.options.arrowDisabledClass);
        }
    },

    /**
     * Re-enables right arrow.
     */
    enableRightArrow: function () {
        if (this.options.rightArrow) {
            this.options.rightArrow.classList.remove(this.options.arrowDisabledClass);
        }
    },

    /**
     * When the left arrow is clicked.
     * @param {Event} e
     */
    onLeftArrowClick: function (e) {
        var isDisabled = this.options.leftArrow.classList.contains(this.options.arrowDisabledClass);
        if (this.options.onLeftArrowClick && !isDisabled) {
            this.options.onLeftArrowClick(e);
        }
    },

    /**
     * When the right arrow is clicked.
     * @param {Event} e
     */
    onRightArrowClick: function (e) {
        var isDisabled = this.options.rightArrow.classList.contains(this.options.arrowDisabledClass);
        if (this.options.onRightArrowClick && !isDisabled) {
            this.options.onRightArrowClick(e);
        }
    },

    /**
     * Final cleanup of instance.
     * @memberOf CarouselArrows
     */
    destroy: function () {
        if (this.options.leftArrow) {
            this.options.leftArrow.kit.removeEventListener('click', 'onLeftArrowClick', this);
        }

        if (this.options.rightArrow) {
            this.options.rightArrow.kit.removeEventListener('click', 'onRightArrowClick', this);
        }
        Module.prototype.destroy.call(this);
    }
});

module.exports = CarouselArrows;