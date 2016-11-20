'use strict';
import Promise from 'promise';
import Module from 'module-js';

export default class CarouselPanel extends Module {

    /**
     * Sets some stuff up.
     * @param {HTMLElement} el - The element that represents a panel.
     * @param {Object} options - The options
     * @param {String} [options.activeClass] - The css class that gets applied when the module is showing
     * @param {String} [options.assetLoadedClass] - The css class that gets added when the asset has been loaded
     * @param {String} [options.lazyLoadAttr] - The lazy loading attribute of the panel element containing the src to load
     */
    constructor (el, options) {
        options = Object.assign({
            activeClass: 'carousel-panel-active',
            lazyLoadAttr: null,
            loadedClass: 'carousel-panel-loaded',
            assetLoadedClass: 'carousel-panel-asset-loaded'
        }, options);
        super(el, options);
        this.options = options;
        this.el = el;
    }

    /**
     * Loads all lazy-loadable images within the panel.
     * @returns {Promise}
     */
    load () {
        let loadPromises = [];
        this._loadableImages().forEach((imgEl) => {
            let loadedClass = this.options.assetLoadedClass;
            let promise = this._loadImage(imgEl)
                .then(() => {
                    this.el.classList.add(loadedClass);
                });
            loadPromises.push(promise);
        });

        return super.load().then(() => {
            return Promise.all(loadPromises);
        });
    }

    /**
     * Gets the live set of loadable image elements within the panel (or the panel itself if it is an <img>).
     * @returns {Array}
     * @private
     */
    _loadableImages () {
        // if panel has lazy load attribute,  add to loadable assets
        if (this.el.tagName.toLowerCase() === 'img' && this.el.getAttribute(this.options.lazyLoadAttr)) {
            return [this.el];
        } else {
            return Array.prototype.slice.call(this.el.querySelectorAll('img[' + this.options.lazyLoadAttr + ']'));
        }
    }

    /**
     * Manually lazy loads a resource using an element's data attribute.
     * @param {HTMLImageElement} img - The image element to load
     * @private
     */
    _loadImage (img) {
        var src = img.getAttribute(this.options.lazyLoadAttr);
        return new Promise(function (resolve) {
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                // IE 9-11 have an issue where it automatically triggers an error on some images,
                // and then will immediately trigger onload() causing intermittent errors to appear
                // until this is fixed or we have a workaround, we will be resolving
                // even if there is an error
                resolve(img);
            };
            img.src = src;
        });
    }
}
