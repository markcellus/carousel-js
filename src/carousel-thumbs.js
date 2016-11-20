'use strict';

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
 */
export default class CarouselThumbs {

    /**
     * When carousel is instantiated.
     * @param {object} options - Options passed into instance
     * @param {HTMLCollection} [options.thumbnails] - A collection of elements that are the thumbnails
     * @param {string} [options.thumbnailActiveClass] - The CSS class that gets added to a thumbnail element when it becomes active
     * @param {CarouselThumbs~onChange} [options.onChange] - When a new thumbnail becomes active
     * @memberOf CarouselThumbs
     */
    constructor (options) {
        options = Object.assign({
            thumbnails: [],
            thumbnailActiveTriggerEvent: 'click',
            thumbnailActiveClass: 'carousel-thumbnail-active',
            onChange: null
        }, options);

        this.options = options;
        this._thumbnailEventListener = this.onThumbnailEvent.bind(this);
        this.setup();

    }

    /**
     * Sets up the carousel instance by adding event listeners to the thumbnails.
     * @memberOf CarouselThumbs
     */
    setup () {
        var thumbs = this.options.thumbnails;
        if (thumbs.length) {
            this.triggerThumbsEventListener('addEventListener');
        } else {
            console.error('carousel thumb error: no thumbnails were passed to constructor');
        }
    }

    /**
     * When a thumbnail is clicked.
     * @param {MouseEvent} e - The click event
     * @memberOf CarouselThumbs
     */
    onThumbnailEvent (e) {
        if (!this._thumbnailArr) {
            // convert thumbnail HTMLCollection to real array so we can perform necessary array methods
            this._thumbnailArr = Array.prototype.slice.call(this.options.thumbnails);
        }
        var index = this._thumbnailArr.indexOf(e.currentTarget);
        // we are checking that the selected thumbnail is still in the HTMLCollection
        // because it is live introducing the possibility that the element is no longer in the DOM
        if (index !== -1 && index !== this.getCurrentIndex()) {
            this.goTo(index);
            if (this.options.onChange) {
                this.options.onChange(index);
            }
        }
    }

    /**
     * Checks for errors upon initialize.
     * @memberOf CarouselThumbs
     * @private
     */
    _checkForInitErrors () {
        var options = this.options,
            thumbnailCount = options.thumbnails.length;
        if (!thumbnailCount) {
            console.error('carousel error: no thumbnails were passed in constructor');
        }
    }

    /**
     * Makes all thumbnails inactive except for the one at the index provided.
     * @param {Number} index - The new index
     * @memberOf CarouselThumbs
     */
    goTo (index) {
        var thumbs = this.options.thumbnails,
            prevIndex = this.getCurrentIndex() || 0,
            activeClass = this.options.thumbnailActiveClass,
            maxIndex = thumbs.length - 1,
            minIndex = 0;

        if (index > maxIndex || index < minIndex) {
            console.error('carousel thumbnail error: unable to transition to a thumbnail with an index of ' + index + ', it does not exist!');
        }

        thumbs[index].classList.add(activeClass);

        if (prevIndex !== index) {
            thumbs[prevIndex].classList.remove(activeClass);
        }
        this._currentIndex = index;
    }

    /**
     * Gets the current thumbnail index that is showing.
     * @returns {Number} Returns the index
     * @memberOf CarouselThumbs
     */
    getCurrentIndex () {
        return this._currentIndex;
    }

    /**
     * Triggers an event listener method on all thumbnail elements.
     * @param {string} method - The event listener method to call on each of the elements
     */
    triggerThumbsEventListener (method) {
        var count = this.options.thumbnails.length,
            i, el;
        for (i = 0; i < count; i++) {
            el = this.options.thumbnails[i];
            el[method](this.options.thumbnailActiveTriggerEvent, this._thumbnailEventListener);
        }
    }

    /**
     * Destroys the instance.
     * @memberOf CarouselThumbs
     */
    destroy () {
        let thumbs = this.options.thumbnails;
        this._currentIndex = null;
        if (thumbs.length) {
            this.triggerThumbsEventListener('removeEventListener');

        }
    }
}
