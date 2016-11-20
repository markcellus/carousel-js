'use strict';
import Promise from 'promise';
import CarouselPanel from './carousel-panel';

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
export default class CarouselPanels {

    /**
     * When the carousel is instantiated.
     * @param {object} options - Options passed into instance
     * @param {HTMLCollection|NodeList} options.panels - The panels in which to use for the carousel (an array of photos)
     * @param {string} [options.assetLoadedClass] - The CSS class that gets added to a panel el when it is loaded
     * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
     * @param {string} [options.panelBackClass] - The CSS class that gets added to all panel elements that appear before the current panel
     * @param {string} [options.panelForwardClass] - The CSS class that gets added to all panel elements that appear ahead of the current panel
     * @param {CarouselPanels~onChange} [options.onChange] - When the current panel is changed
     * @param {string} [options.lazyLoadAttr] - The lazy loading attribute
     */
    constructor (options) {

        options = Object.assign({
            panels: [],
            assetLoadedClass: 'carousel-asset-loaded',
            panelActiveClass: 'carousel-panel-active',
            panelLoadedClass: 'carousel-panel-loaded',
            onChange: null,
            lazyLoadAttr: 'data-src',
            panelBackClass: 'carousel-panel-behind',
            panelForwardClass: 'carousel-panel-ahead'
        }, options);

        if (!options.panels.length) {
            console.error('carousel error: no panels were passed in constructor');
        } else {
            this._panelModules = this._setupPanelModules(options);
        }

        // add forward classes initially
        this._panelModules.forEach((panel) => {
            panel.el.classList.add(options.panelForwardClass);
        });

        this.options = options;
    }

    /**
     * Sets up the panel module instances.
     * @param {Object} options - The initialization options
     * @returns {Array} Returns an array of the panel instances
     * @private
     */
    _setupPanelModules (options) {
        let modules = [];
        // panels can be either an array or an HTMLCollection so we
        // are doing an old-school for loop to satisify both scenarios
        for (let i = 0; i < options.panels.length; i++) {
            modules[i] = new CarouselPanel(options.panels[i], {
                activeClass: options.panelActiveClass,
                lazyLoadAttr: options.lazyLoadAttr,
                assetLoadedClass: options.assetLoadedClass,
                loadedClass: options.panelLoadedClass
            });
        }
        return modules;

    }

    /**
     * Transitions to a panel of an index.
     * @param {Number} index - The index number to go to
     * @returns {Promise}
     */
    goTo (index) {
        var maxIndex = this.options.panels.length - 1,
            minIndex = 0,
            prevIndex = this.getCurrentIndex(),
            errorMsg,
            promise;

        if (typeof index !== 'number' || index > maxIndex || index < minIndex) {
            errorMsg = 'carousel panel error: unable to transition to an index of ' + index + 'which does not exist!';
            console.error(errorMsg);
            promise = Promise.reject(new Error(errorMsg));
        } else if (prevIndex === index) {
            // already at index
            promise = Promise.resolve();
        } else {
            promise = this.load(index);
            this._updatePanels(index);
            this._currentIndex = index;
            if (this.options.onChange) {
                this.options.onChange(index)
            }
        }
        return promise;
    }

    /**
     * Makes all panels inactive except for the one at the index provided.
     * @param {Number} toIndex - The new index
     * @private
     */
    _updatePanels (toIndex) {
        let fromIndex = this.getCurrentIndex();
        let fromPanel = this._panelModules[fromIndex];
        let toPanel = this._panelModules[toIndex];
        let rangePanels = [];
        let toAdd = '';
        let toRemove = '';

        if (fromIndex > toIndex) {
            // include fromIndex but not toIndex
            rangePanels = this._panelModules.slice(toIndex + 1, fromIndex + 1);
            toAdd = this.options.panelForwardClass;
            toRemove = this.options.panelBackClass;
        } else if (fromIndex < toIndex) {
            rangePanels = this._panelModules.slice(fromIndex, toIndex);
            toAdd = this.options.panelBackClass;
            toRemove = this.options.panelForwardClass;
        }

        rangePanels.forEach((p) => {
            p.el.classList.add(toAdd);
            p.el.classList.remove(toRemove);
        });

        if (fromPanel) {
            fromPanel.hide();
        }
        toPanel.el.classList.remove(this.options.panelForwardClass, this.options.panelBackClass);
        toPanel.show();
    }

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     */
    getCurrentIndex () {
        return this._currentIndex;
    }

    /**
     * Loads assets for a given panel.
     * @param {Number} idx - The index of the panel containing the assets to load
     * @returns {Promise}
     */
    load (idx) {
        let panelModule = this._panelModules[idx];
        if (panelModule.loaded) {
            return Promise.resolve();
        }
        return panelModule.load();
    }

    /**
     * Loads assets for a given panel.
     * @deprecated since 2.1.6
     * @param {Number} index - The index of the panel containing the assets to load
     * @returns {Promise}
     */
    loadPanelAssets (index) {
        return this.load(index);
    }

    /**
     * Final cleanup of instance.
     */
    destroy () {
        var options = this.options,
            currentIndex = this.getCurrentIndex();

        if (currentIndex) {
            options.panels[currentIndex].classList.remove(options.panelActiveClass);
        }
        this._currentIndex = undefined;

        this._panelModules.forEach((module) => {
            module.el.classList.remove(options.panelForwardClass, options.panelBackClass);
            module.destroy();
        });
    }
}
