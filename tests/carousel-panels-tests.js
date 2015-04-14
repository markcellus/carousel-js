var sinon = require('sinon');
var CarouselPanels = require('../src/carousel-panels');
var assert = require('assert');
var Promise = require('promise');

describe('Carousel Panels', function () {

    it('loadPanelImageAsset() passes lazy loading attribute of the the image element passed to element kit\'s load() call', function () {
        var image = document.createElement('img');
        var testSrc = 'blank.jpg';
        image.setAttribute('data-test-src', testSrc);
        image.kit.load = sinon.stub().returns(Promise.resolve());
        var panelsView = new CarouselPanels({panels: [image], lazyLoadAttr: 'data-test-src'});
        panelsView.loadPanelImageAsset(image);
        assert.ok(image.kit.load.args[0][0], testSrc, 'element kits image load is passed correct arguments');
        panelsView.destroy();
    });

    it('loadPanelImageAsset() should add loading class to image element initially', function () {
        var image = document.createElement('img');
        image.kit.load = sinon.stub().returns(Promise.resolve()); // prevent attempt to get actual image
        var imageLoadingClass = 'loading';
        var panelsView = new CarouselPanels({panels: [image], assetLoadingClass: imageLoadingClass});
        panelsView.loadPanelImageAsset(image);
        assert.ok(image.classList.contains(imageLoadingClass), 'loading class is added initially');
    });

    it('loadPanelImageAsset() should remove loading class when image is done loading', function () {
        var image = document.createElement('img');
        image.kit.load = sinon.stub().returns(Promise.resolve()); // prevent attempt to get actual image
        var imageLoadingClass = 'loading';
        var panelsView = new CarouselPanels({panels: [image], assetLoadingClass: imageLoadingClass});
        return panelsView.loadPanelImageAsset(image).then(function () {
            assert.ok(!image.classList.contains(imageLoadingClass), 'once image is loaded, the loading class is removed');
            panelsView.destroy();
        });
    });

    it('going to a panel that is an image should call loadPanelImageAsset() with that image element', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var baseUrl = 'http://test/';
        carouselEl.innerHTML =
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c2.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c3.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c4.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c5.jpg" />';

        var images = carouselEl.getElementsByTagName('img');
        var loadPanelImageAssetStub = sinon.stub(CarouselPanels.prototype, 'loadPanelImageAsset');
        var panelsView = new CarouselPanels({panels: carouselEl.getElementsByTagName('img')});
        panelsView.goTo(2);
        assert.equal(loadPanelImageAssetStub.args[0][0], images[2], 'third image element was passed to loadPanelImageAsset() method');
        loadPanelImageAssetStub.restore();
        panelsView.destroy();
    });

    it('should pass all image elements inside a panel to loadPanelImageAsset() when transitioning to the panel', function () {
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var baseUrl = 'http://test2/';
        carouselEl.innerHTML =
            '<div class="carousel-panel">' +
                '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c1.jpg" />' +
                '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c2.jpg" />' +
            '</div>' +
            '<div class="carousel-panel">' +
                '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c3.jpg" />' +
                '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c4.jpg" />' +
                '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c5.jpg" />' +
            '</div>';
        var loadPanelImageAssetStub = sinon.stub(CarouselPanels.prototype, 'loadPanelImageAsset');
        var panelsView = new CarouselPanels({
            panels: carouselEl.getElementsByClassName('carousel-panel'),
            assetClass: 'carousel-item'
        });
        var images = carouselEl.getElementsByTagName('img');
        panelsView.goTo(0);
        assert.equal(loadPanelImageAssetStub.args[0][0], images[0], 'first panel\'s first image element was passed to loadPanelImageAsset()');
        assert.equal(loadPanelImageAssetStub.args[1][0], images[1], 'first panel\'s second image element was passed to loadPanelImageAsset()');
        panelsView.destroy();
        loadPanelImageAssetStub.restore();
    });

});