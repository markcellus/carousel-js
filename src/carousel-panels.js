'use strict';
import _ from 'lodash';
import Module from 'module-js';
import Promise from 'promise';

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
 */
class CarouselPanels extends Module {

    /**
     * When the carousel is instantiated.
     * @param {object} options - Options passed into instance
     * @param {HTMLCollection} options.panels - The panels in which to use for the carousel (an array of photos)
     * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
     * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
     * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
     * @param {CarouselPanels~onChange} [options.onChange] - When the current panel is changed
     * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
     */
    constructor (options) {

        options = _.extend({
            panels: [],
            assetLoadingClass: 'carousel-asset-loading',
            autoLoadAssets: true,
            panelActiveClass: 'carousel-panel-active',
            onChange: null,
            lazyLoadAttr: 'data-src'
        }, options);

        super(options);

        if (!options.panels.length) {
            console.error('carousel error: no panels were passed in constructor');
        }

        this.options = options;
    }

    /**
     * Transitions to a panel of an index.
     * @param {Number} index - The index number to go to
     * @memberOf CarouselPanels
     * @returns {Promise}
     */
    goTo (index) {
        var maxIndex = this.options.panels.length - 1,
            minIndex = 0,
            prevIndex = this.getCurrentIndex(),
            errorMsg,
            promise = Promise.resolve();

        if (typeof index !== 'number' || index > maxIndex || index < minIndex) {
            errorMsg = 'carousel panel error: unable to transition to an index of ' + index + 'which does not exist!';
            console.error(errorMsg);
            promise = Promise.reject(new Error(errorMsg));
        } else if (prevIndex === index) {
            // already at index
            promise = Promise.resolve();
        } else {
            this._updatePanels(index);
            if (this.options.autoLoadAssets) {
                promise = this.loadPanelAssets(index);
            }
            this._currentIndex = index;
            if (this.options.onChange) {
                this.options.onChange(index)
            }
        }
        return promise;
    }

    /**
     * Makes all panels inactive except for the one at the index provided.
     * @param {Number} index - The new index
     * @memberOf CarouselPanels
     * @private
     */
    _updatePanels (index) {
        var panels = this.options.panels,
            prevIndex = this.getCurrentIndex();
        if (prevIndex !== undefined) {
            panels[prevIndex].classList.remove(this.options.panelActiveClass);
        }
        panels[index].classList.add(this.options.panelActiveClass);
    }

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     * @memberOf CarouselPanels
     */
    getCurrentIndex () {
        return this._currentIndex;
    }

    /**
     * Loads assets for a given panel.
     * @param {Number} index - The index of the panel containing the assets to load
     * @memberOf CarouselPanels
     * @returns {Promise}
     */
    loadPanelAssets (index) {
        var options = this.options,
            panel = options.panels[index],
            assets = panel.querySelectorAll('[' + options.lazyLoadAttr + ']'),
            loadPromises = [];

        // convert NodeList to real array in order to call Array methods on it
        assets = Array.prototype.slice.call(assets);

        // if panel has lazy load attribute, add to loadable assets
        if (panel.getAttribute(options.lazyLoadAttr)) {
            assets.push(panel);
        }

        assets.forEach(function (el) {
            if (el.tagName.toLowerCase() === 'img') {
                loadPromises.push(this.loadPanelImageAsset(el));
            }
        }, this);

        return Promise.all(loadPromises);
    }

    /**
     * Manually lazy loads a resource using an element's data attribute.
     * @param {HTMLImageElement} img - The image element to load
     * @memberOf CarouselPanels
     */
    loadPanelImageAsset (img) {
        var src = img.getAttribute(this.options.lazyLoadAttr),
            loadingClass = this.options.assetLoadingClass;
        img.classList.add(loadingClass);
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
        }).then(function() {
                img.classList.remove(loadingClass);
            })
            .catch(function () {
                img.classList.remove(loadingClass);
            });
    }

    /**
     * Final cleanup of instance.
     * @memberOf CarouselPanels
     */
    destroy () {
        var options = this.options,
            currentIndex = this.getCurrentIndex();

        if (currentIndex) {
            options.panels[currentIndex].classList.remove(options.panelActiveClass);
        }
        this._currentIndex = null;
        super.destroy();
    }
}

module.exports = CarouselPanels;
