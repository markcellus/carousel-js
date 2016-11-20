'use strict';

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
export default class CarouselArrows {

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
    constructor (options) {

        options = Object.assign({
            leftArrow: null,
            rightArrow: null,
            panels: [],
            arrowDisabledClass: 'carousel-arrow-disabled',
            onLeftArrowClick: null,
            onRightArrowClick: null,
            initialIndex: 0
        }, options);

        if (!options.leftArrow && !options.rightArrow) {
            console.error('Carousel Arrows Error: no left and right arrows were passed into constructor');
        }

        this.options = options;

        this.arrows = [];

        // setup listeners
        if (options.leftArrow) {
            this.arrows.push(options.leftArrow);
            this._leftArrowEventListener = e => this.onLeftArrowClick(e);
            options.leftArrow.addEventListener('click', this._leftArrowEventListener);
        }

        if (options.rightArrow) {
            this.arrows.push(options.rightArrow);
            this._rightArrowEventListener = e => this.onRightArrowClick(e);
            options.rightArrow.addEventListener('click', this._rightArrowEventListener);
        }
    }

    /**
     * Updates the arrow based on the supplied panel index.
     * @param {Number} panelIndex - The new panel index
     */
    update (panelIndex) {
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

    }

    /**
     * Disables all arrows
     */
    disable () {
        this.disableLeftArrow();
        this.disableRightArrow();
    }

    /**
     * Disables left arrow.
     */
    disableLeftArrow () {
        if (this.options.leftArrow) {
            this.options.leftArrow.classList.add(this.options.arrowDisabledClass);
        }
    }

    /**
     * Disables right arrow.
     */
    disableRightArrow () {
        if (this.options.rightArrow) {
            this.options.rightArrow.classList.add(this.options.arrowDisabledClass);
        }
    }

    /**
     * Re-enables all arrows.
     */
    enable () {
        this.enableLeftArrow();
        this.enableRightArrow();
    }

    /**
     * Re-enables left arrow.
     */
    enableLeftArrow () {
        if (this.options.leftArrow) {
            this.options.leftArrow.classList.remove(this.options.arrowDisabledClass);
        }
    }

    /**
     * Re-enables right arrow.
     */
    enableRightArrow () {
        if (this.options.rightArrow) {
            this.options.rightArrow.classList.remove(this.options.arrowDisabledClass);
        }
    }

    /**
     * When the left arrow is clicked.
     * @param {Event} e
     */
    onLeftArrowClick (e) {
        var isDisabled = this.options.leftArrow.classList.contains(this.options.arrowDisabledClass);
        if (this.options.onLeftArrowClick && !isDisabled) {
            this.options.onLeftArrowClick(e);
        }
    }

    /**
     * When the right arrow is clicked.
     * @param {Event} e
     */
    onRightArrowClick (e) {
        var isDisabled = this.options.rightArrow.classList.contains(this.options.arrowDisabledClass);
        if (this.options.onRightArrowClick && !isDisabled) {
            this.options.onRightArrowClick(e);
        }
    }

    /**
     * Final cleanup of instance.
     * @memberOf CarouselArrows
     */
    destroy () {
        if (this.options.leftArrow) {
            this.options.leftArrow.removeEventListener('click', this._leftArrowEventListener);
        }

        if (this.options.rightArrow) {
            this.options.rightArrow.removeEventListener('click', this._rightArrowEventListener);
        }
    }
}
