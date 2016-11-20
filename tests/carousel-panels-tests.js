"use strict";
import CarouselPanels from './../src/carousel-panels';
import CarouselPanel from './../src/carousel-panel';
var sinon = require('sinon');
var assert = require('assert');
var Promise = require('promise');

describe('Carousel Panels', function () {

    var createPanelInstance = function (el) {
        var panel = sinon.createStubInstance(CarouselPanel);
        panel.load = sinon.stub().returns(Promise.resolve());
        panel.show = sinon.stub().returns(Promise.resolve());
        panel.hide = sinon.stub().returns(Promise.resolve());
        panel.el = el;
        return panel;
    };

    it('should pass the same index passed to goTo to the load call', function () {
        var carouselEl = document.createElement('div');
        var baseUrl = 'http://test/';
        carouselEl.innerHTML =
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c2.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c3.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c4.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c5.jpg" />';

        var panelsView = new CarouselPanels({panels: carouselEl.getElementsByTagName('img')});
        var loadSpy = sinon.stub(panelsView, 'load').returns(Promise.resolve());
        var testIndex = 2;
        panelsView.goTo(testIndex);
        assert.equal(loadSpy.args[0][0], testIndex);
        panelsView.destroy();
        loadSpy.restore();
    });

    it('should call Carousel Panel\'s load method appropriately', function () {
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
        var loadStub = sinon.stub(CarouselPanel.prototype, 'load').returns(Promise.resolve());
        var panelsView = new CarouselPanels({
            panels: carouselEl.getElementsByClassName('carousel-panel')
        });
        panelsView.goTo(0);
        assert.equal(loadStub.callCount, 1);
        panelsView.goTo(1);
        assert.equal(loadStub.callCount, 2);
        panelsView.destroy();
        loadStub.restore();
    });


    it('should call the show method of the Carousel Panel instance that matches the index passed to the goTo()', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panelEls = carouselEl.getElementsByClassName('carousel-panel');
        var firstPanelInstance = createPanelInstance(panelEls[0]);
        var secondPanelInstance = createPanelInstance(panelEls[1]);
        var thirdPanelInstance = createPanelInstance(panelEls[2]);

        var setupPanelModulesStub = sinon.stub(CarouselPanels.prototype, '_setupPanelModules').returns([
            firstPanelInstance, secondPanelInstance, thirdPanelInstance
        ]);
        var panelsView = new CarouselPanels({
            panels: panelEls
        });
        return panelsView.goTo(0).then(function () {
            assert.equal(firstPanelInstance.show.callCount, 1);
            assert.equal(secondPanelInstance.show.callCount, 0);
            return panelsView.goTo(2).then(function () {
                assert.equal(thirdPanelInstance.show.callCount, 1);
                assert.equal(firstPanelInstance.show.callCount, 1);
                panelsView.destroy();
                setupPanelModulesStub.restore();
            });
        });
    });

    it('should call the load method of the Carousel Panel instance before calling show method when goTo() is called', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>';
        var loadStub = sinon.stub(CarouselPanel.prototype, 'load').returns(Promise.resolve());
        var showStub = sinon.stub(CarouselPanel.prototype, 'show').returns(Promise.resolve());
        var panelsView = new CarouselPanels({
            panels: carouselEl.getElementsByClassName('carousel-panel')
        });
        panelsView.goTo(0);
        assert.equal(loadStub.calledBefore(showStub), true);
        panelsView.destroy();
        showStub.restore();
        loadStub.restore();
    });

    it('should call the hide method of previous Carousel Panel instance when calling goTo() on a new index', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panelEls = carouselEl.getElementsByClassName('carousel-panel');
        var firstPanelInstance = createPanelInstance(panelEls[0]);
        var secondPanelInstance = createPanelInstance(panelEls[1]);
        var thirdPanelInstance = createPanelInstance(panelEls[2]);

        var setupPanelModulesStub = sinon.stub(CarouselPanels.prototype, '_setupPanelModules').returns([
            firstPanelInstance, secondPanelInstance, thirdPanelInstance
        ]);
        var panelsView = new CarouselPanels({
            panels: panelEls
        });
        assert.equal(firstPanelInstance.hide.callCount, 0);
        assert.equal(secondPanelInstance.hide.callCount, 0);
        assert.equal(thirdPanelInstance.hide.callCount, 0);
        return panelsView.goTo(0).then(function () {
            assert.equal(firstPanelInstance.hide.callCount, 0);
            assert.equal(secondPanelInstance.hide.callCount, 0);
            assert.equal(thirdPanelInstance.hide.callCount, 0);
            return panelsView.goTo(2).then(function () {
                assert.equal(firstPanelInstance.hide.callCount, 1);
                assert.equal(secondPanelInstance.hide.callCount, 0);
                assert.equal(thirdPanelInstance.hide.callCount, 0);
                return panelsView.goTo(1).then(function () {
                    assert.equal(firstPanelInstance.hide.callCount, 1);
                    assert.equal(secondPanelInstance.hide.callCount, 0);
                    assert.equal(thirdPanelInstance.hide.callCount, 1);
                    panelsView.destroy();
                    setupPanelModulesStub.restore();
                })
            });
        });
    });

    it('should add a forward css class to panel element when advancing to previous one', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panelEls = carouselEl.getElementsByClassName('carousel-panel');
        var firstPanelInstance = createPanelInstance(panelEls[0]);
        var secondPanelInstance = createPanelInstance(panelEls[1]);
        var thirdPanelInstance = createPanelInstance(panelEls[2]);

        var setupPanelModulesStub = sinon.stub(CarouselPanels.prototype, '_setupPanelModules').returns([
            firstPanelInstance, secondPanelInstance, thirdPanelInstance
        ]);
        var forwardClass = 'panel-ahead';
        var panelsView = new CarouselPanels({
            panels: panelEls,
            panelForwardClass: forwardClass
        });
        assert.ok(firstPanelInstance.el.classList.contains(forwardClass));
        assert.ok(secondPanelInstance.el.classList.contains(forwardClass));
        assert.ok(thirdPanelInstance.el.classList.contains(forwardClass));
        return panelsView.goTo(0).then(function () {
            assert.ok(!firstPanelInstance.el.classList.contains(forwardClass));
            assert.ok(secondPanelInstance.el.classList.contains(forwardClass));
            assert.ok(thirdPanelInstance.el.classList.contains(forwardClass));
            return panelsView.goTo(2).then(function () {
                assert.ok(!firstPanelInstance.el.classList.contains(forwardClass));
                assert.ok(!secondPanelInstance.el.classList.contains(forwardClass));
                assert.ok(!thirdPanelInstance.el.classList.contains(forwardClass));
                return panelsView.goTo(1).then(function () {
                    assert.ok(!firstPanelInstance.el.classList.contains(forwardClass));
                    assert.ok(!secondPanelInstance.el.classList.contains(forwardClass));
                    assert.ok(thirdPanelInstance.el.classList.contains(forwardClass));
                    return panelsView.goTo(0).then(function () {
                        assert.ok(!firstPanelInstance.el.classList.contains(forwardClass));
                        assert.ok(secondPanelInstance.el.classList.contains(forwardClass));
                        assert.ok(thirdPanelInstance.el.classList.contains(forwardClass));
                        panelsView.destroy();
                        setupPanelModulesStub.restore();
                    });
                })
            });
        });
    });

    it('should add a behind css class to panel element when advancing to previous one', function () {
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';
        var panelEls = carouselEl.getElementsByClassName('carousel-panel');
        var firstPanelInstance = createPanelInstance(panelEls[0]);
        var secondPanelInstance = createPanelInstance(panelEls[1]);
        var thirdPanelInstance = createPanelInstance(panelEls[2]);

        var setupPanelModulesStub = sinon.stub(CarouselPanels.prototype, '_setupPanelModules').returns([
            firstPanelInstance, secondPanelInstance, thirdPanelInstance
        ]);
        var behindClass = 'panel-behind';
        var panelsView = new CarouselPanels({
            panels: panelEls,
            panelBackClass: behindClass
        });
        assert.ok(!firstPanelInstance.el.classList.contains(behindClass));
        assert.ok(!secondPanelInstance.el.classList.contains(behindClass));
        assert.ok(!thirdPanelInstance.el.classList.contains(behindClass));
        return panelsView.goTo(0).then(function () {
            assert.ok(!firstPanelInstance.el.classList.contains(behindClass));
            assert.ok(!secondPanelInstance.el.classList.contains(behindClass));
            assert.ok(!thirdPanelInstance.el.classList.contains(behindClass));
            return panelsView.goTo(2).then(function () {
                assert.ok(firstPanelInstance.el.classList.contains(behindClass));
                assert.ok(secondPanelInstance.el.classList.contains(behindClass));
                assert.ok(!thirdPanelInstance.el.classList.contains(behindClass));
                return panelsView.goTo(1).then(function () {
                    assert.ok(firstPanelInstance.el.classList.contains(behindClass));
                    assert.ok(!secondPanelInstance.el.classList.contains(behindClass));
                    assert.ok(!thirdPanelInstance.el.classList.contains(behindClass));
                    return panelsView.goTo(0).then(function () {
                        assert.ok(!firstPanelInstance.el.classList.contains(behindClass));
                        assert.ok(!secondPanelInstance.el.classList.contains(behindClass));
                        assert.ok(!thirdPanelInstance.el.classList.contains(behindClass));
                        panelsView.destroy();
                        setupPanelModulesStub.restore();
                    });
                })
            });
        });
    });

    it('should NOT call show() method on panel instance again if currently showing', function () {
        var carouselEl = document.createElement('div');
        var baseUrl = 'http://test/';
        carouselEl.innerHTML =
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c2.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c3.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c4.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="' + baseUrl + 'c5.jpg" />';
        var showCallCount = 0;
        var showStub = sinon.stub(CarouselPanel.prototype, 'show').returns(Promise.resolve());
        var panelsView = new CarouselPanels({panels: carouselEl.getElementsByTagName('img')});
        var testIndex = 2;
        panelsView.goTo(testIndex);
        showCallCount++;
        panelsView.goTo(testIndex);
        assert.equal(showStub.callCount, showCallCount);
        panelsView.destroy();
        showStub.restore();
    });

});
