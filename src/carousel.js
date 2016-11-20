'use strict';
import CarouselThumbs from './carousel-thumbs';
import CarouselPanels from './carousel-panels';
import CarouselArrows from './carousel-arrows';
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
 * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
 * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
 * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
 * @param {string} [options.panelLoadedClass] - The CSS class that gets added to an panel when it is fully loaded
 * @param {string} [options.panelBackClass] - The CSS class that gets added to all panel elements that appear before the current panel
 * @param {string} [options.panelForwardClass] - The CSS class that gets added to all panel elements that appear ahead of the current panel
 * @param {Carousel~onPanelChange} [options.onPanelChange] - When the current panel is changed
 * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
 * @param {HTMLCollection} [options.thumbnails] - A collection of elements that are the thumbnails
 * @param {string} [options.thumbnailActiveClass] - The CSS class that gets added to a thumbnail element when it becomes active
 * @param {Number} [options.initialIndex] - The index of the panel to go to upon instantiation (if not declared, goTo() must be called manually).
 */

export default class Carousel {

    /**
     * Sets up stuff.
     * @param options
     */
    constructor (options) {

        options = options || {};

        // if undefined or null is passed in options for panels or thumbnails,
        // we need to sanitize it to an empty array to prevent a crash
        if (!options.panels) {
            options.panels = [];
        }
        if (!options.thumbnails) {
            options.thumbnails = [];
        }

        options = Object.assign({
            panels: [],
            assetLoadingClass: 'carousel-asset-loading',
            autoLoadAssets: true,
            panelActiveClass: 'carousel-panel-active',
            panelLoadedClass: 'carousel-panel-loaded',
            panelBackClass: 'carousel-panel-behind',
            panelForwardClass: 'carousel-panel-ahead',
            onPanelChange: null,
            lazyLoadAttr: 'data-src',
            thumbnails: [],
            thumbnailActiveTriggerEvent: 'click',
            thumbnailActiveClass: 'carousel-thumbnail-active',
            initialIndex: 0,
            leftArrow: null,
            rightArrow: null,
            arrowActiveClass: 'carousel-arrow-active',
            arrowDisabledClass: 'carousel-arrow-disabled',
            onLeftArrowClick: null,
            onRightArrowClick: null
        }, options);

        this.options = options;
        this.subModules = {};
        this._checkForInitErrors();
        this.setup();
    }

    /**
     * Sets up the carousel instance and all controls.
     */
    setup () {

        if (!this.subModules.panels) {
            this.subModules.panels = this._setupPanels(this.options);
        }

        if (this.options.thumbnails.length && !this.subModules.thumbnails) {
            this.subModules.thumbnails = this._setupThumbs(this.options);
        }

        if ((this.options.leftArrow || this.options.rightArrow) && !this.subModules.arrows) {
            this.subModules.arrows = this._setupArrows(this.options);
        }

        if (typeof this.options.initialIndex === 'number') {
            this.goTo(this.options.initialIndex);
        }
    }

    /**
     * Sets up the carousel thumbs.
     * @param {Object} options - The initialize options
     * @return {CarouselThumbs} Returns thumbnail instance
     * @private
     */
    _setupThumbs (options) {
         return new CarouselThumbs(Object.assign({}, options, {
            onChange: this.onThumbnailChange.bind(this)
        }));
    }

    /**
     * Sets up the carousel panels.
     * @param {Object} options - The initialize options
     * @return {CarouselPanels} Returns panels instance
     * @private
     */
    _setupPanels (options) {
        if (options.panels.length) {
            return new CarouselPanels(Object.assign({}, options, {
                onChange: this.onPanelChange.bind(this)
            }));
        }
    }

    /**
     * Sets up the carousel arrows.
     * @param {Object} options - The initialize options
     * @return {CarouselArrows} Returns arrows instance
     * @private
     */
    _setupArrows (options) {
        var internalOptions;
        // make clone of original options
        internalOptions = Object.assign({}, options);

        internalOptions.onLeftArrowClick = this.onLeftArrowClick.bind(this);
        internalOptions.onRightArrowClick = this.onRightArrowClick.bind(this);
        return new CarouselArrows(internalOptions);
    }

    /**
     * Checks for errors upon initialize.
     * @private
     */
    _checkForInitErrors () {
        var options = this.options,
            panelCount = options.panels.length,
            thumbnailCount = options.thumbnails.length;
        if (thumbnailCount && thumbnailCount !== panelCount) {
            console.warn('carousel warning: number of thumbnails passed in constructor do not equal the number of panels' + '\n' +
            'panels: ' + panelCount + '\n' +
            'thumbnails: ' + thumbnailCount + '\n');
        }
    }

    /**
     * When a panel index changes.
     * @param {Number} index - The new index
     */
    onPanelChange (index) {
        if (this.subModules.thumbnails) {
            this.subModules.thumbnails.goTo(index);
        }

        if (this.subModules.arrows) {
            this.subModules.arrows.update(index);
        }

        if (this.options.onPanelChange) {
            this.options.onPanelChange(index)
        }
    }

    /**
     * When the thumbnail index changes.
     * @param {Number} index - The new index
     */
    onThumbnailChange (index) {
        this.goTo(index);
    }

    /**
     * When the right arrow of the carousel is clicked.
     * @param e
     */
    onRightArrowClick (e) {
        this.goTo(this.subModules.panels.getCurrentIndex() + 1);
        if (this.options.onRightArrowClick) {
            this.options.onRightArrowClick(e);
        }
    }

    /**
     * When the left arrow of the carousel is clicked.
     * @param e
     */
    onLeftArrowClick (e) {
        this.goTo(this.subModules.panels.getCurrentIndex() - 1);
        if (this.options.onLeftArrowClick) {
            this.options.onLeftArrowClick(e);
        }
    }

    /**
     * Transition to a new panel and thumbnail.
     * @param {Number} index - The index number to go to
     */
    goTo (index) {
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

        if (this.subModules.thumbnails) {
            this.subModules.thumbnails.goTo(index);
        }
        if (this.subModules.arrows) {
            this.subModules.arrows.update(index);
        }

        if (this.subModules.panels) {
            return this.subModules.panels.goTo(index);
        }
    }

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     */
    getCurrentIndex () {
        return this.subModules.panels.getCurrentIndex();
    }

    /**
     * Moves carousel to next panel.
     */
    next () {
        this.goTo(this.getCurrentIndex() + 1);
    }

    /**
     * Moves to previous carousel panel.
     */
    prev () {
        this.goTo(this.getCurrentIndex() - 1);
    }

    /**
     * Destroys all sub modules.
     */
    destroy () {
        for (let key in this.subModules) {
            if (this.subModules.hasOwnProperty(key) && this.subModules[key]) {
                this.subModules[key].destroy();
            }
        }
    }
}
