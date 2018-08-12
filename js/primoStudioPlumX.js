(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _plumx = require('./plumx.controller');

var _plumx2 = _interopRequireDefault(_plumx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * plumx.component.js
 */

var plumxTemplate = '<div id="plumx_widget" ng-if="$ctrl.doi">\n    <a href="$ctrl.plumx_url"\n       class="$ctrl.plumx_class"\n       data-size="large"\n       data-popup="$ctrl.plumx_popup"\n       data-badge="$ctrl.plumx_badge"\n       data-site="plum"\n       data-hide-when-empty="true">PlumX</a>\n</div>\n';


var PrimoStudioPlumXComponent = {
    selector: 'primoStudioPlumX',
    controller: _plumx2.default,
    bindings: { parentCtrl: '<' },
    template: plumxTemplate
};

exports.default = PrimoStudioPlumXComponent;

},{"./plumx.controller":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * plumx.controller.js
 */

var PrimoStudioPlumXController = function () {
    function PrimoStudioPlumXController(angularLoad, studioConfig, $http, $scope, $element, $timeout, $window) {
        _classCallCheck(this, PrimoStudioPlumXController);

        this.angularLoad = angularLoad;
        this.studioConfig = studioConfig;
        this.$http = $http;
        this.$scope = $scope;
        this.$element = $element;
        this.$timeout = $timeout;
        this.$window = $window;
    }

    _createClass(PrimoStudioPlumXController, [{
        key: 'getConfigApiKey',
        value: function getConfigApiKey() {
            return this.studioConfig[0].apikey || '';
        }
    }, {
        key: 'getConfigISBN',
        value: function getConfigISBN() {
            return this.studioConfig[0].isbn || '';
        }
    }, {
        key: 'getConfigWidgetType',
        value: function getConfigWidgetType() {
            return this.studioConfig[0].widgettype || 'print';
        }
    }, {
        key: 'getConfigWidgetTheme',
        value: function getConfigWidgetTheme() {
            return this.studioConfig[0].widgettheme || 'default';
        }
    }, {
        key: '$onInit',
        value: function $onInit() {

            var vm = this;

            vm.embed_js = '';

            vm.plumx_js = 'https://d39af2mgp1pqhg.cloudfront.net/widget-';
            vm.plumx_url = '';
            vm.plumx_popup = '';
            vm.plumx_badge = '';

            switch (vm.getConfigWidgetType()) {
                default:
                case 'print':
                    vm.plumx_class = 'plumx-plum-print-popup';
                    vm.plumx_popup = 'right';
                    vm.plumx_js += 'popup.js';
                    break;
                case 'details':
                    vm.plumx_class = 'plumx-details';
                    vm.plumx_js += 'details.js';
                    break;
                case 'summary':
                    vm.plumx_class = 'plumx-summary';
                    vm.plumx_js += 'summary.js';
                    break;
                case 'badge':
                    vm.plumx_class = 'plumx-plum-print-popup';
                    vm.plumx_popup = 'right';
                    vm.plumx_badge = 'true';
                    vm.plumx_js += 'popup.js';
                    break;
            }
            switch (vm.getConfigWidgetTheme()) {
                default:
                case 'default':
                    break;
                case 'bigben':
                    vm.plumx_class += ' plumx-bigben-theme';
                    break;
                case 'liberty':
                    vm.plumx_class += ' plumx-liberty-theme';
                    break;
            }

            // the prm-full-view container, our parent is prm-full-view-after
            vm.parentElement = vm.$element.parent().parent()[0];

            vm.api = 'doi';
            try {
                vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
            } catch (e) {
                try {
                    if (vm.getConfigISBN()) {
                        vm.doi = vm.parentCtrl.item.pnx.addata.isbn[0] || '';
                        vm.api = 'isbn';
                    }
                } catch (e) {
                    return;
                }
            }

            if (vm.doi) {
                vm.$timeout(function () {
                    vm.plumx_url = 'https://plu.mx/plum/a/?' + vm.api + '=' + vm.doi;
                    vm.$http.head(vm.plumx_url).then(function (res) {
                        // Get the PlumX script
                        vm.embed_js = vm.plumx_js + '?' + Date.now();
                        vm.angularLoad.loadScript(vm.embed_js).then(function () {
                            // Create our new Primo service
                            var plumxSection = {
                                scrollId: "plumx",
                                serviceName: "plumx",
                                title: "brief.results.tabs.PlumX"
                            };
                            vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, plumxSection);
                        }, function (res) {
                            console.log('plumx loadScript failed: ' + res);
                        });
                    }, function (res) {
                        console.log('plumx api failed: ' + res);
                    });
                }, 3000);
            }

            // move the plumx widget into the new PlumX service section
            var unbindWatcher = vm.$scope.$watch(function () {
                return vm.parentElement.querySelector('h4[translate="brief.results.tabs.PlumX"]');
            }, function (newVal, oldVal) {
                if (newVal) {
                    // Get the section body associated with the value we're watching
                    var sectionBody = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
                    if (sectionBody && sectionBody.appendChild) {
                        sectionBody.appendChild(vm.$element[0]);
                    }
                    unbindWatcher();
                }
            });
        }
    }, {
        key: '$onDestroy',
        value: function $onDestroy() {
            var vm = this;
            var el = null;

            if (vm.$window.__plumX) {
                delete vm.$window.__plumX;
            }

            // remove css/js
            if (vm.embed_js) {
                el = document.body.querySelector('[src="' + vm.embed_js + '"]');
                if (el) {
                    el.remove();
                }
                vm.embed_js = '';
            }

            el = document.head.querySelector('link[id="plx-css-popup"]');
            if (el) {
                el.remove();
            }
        }
    }]);

    return PrimoStudioPlumXController;
}();

PrimoStudioPlumXController.$inject = ['angularLoad', 'primoStudioPlumXStudioConfig', '$http', '$scope', '$element', '$timeout', '$window'];

exports.default = PrimoStudioPlumXController;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrimoStudioPlumXModule = undefined;

var _plumx = require('./plumx.component');

var _plumx2 = _interopRequireDefault(_plumx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PrimoStudioPlumXModule = exports.PrimoStudioPlumXModule = angular.module('primoStudioPlumX', []).component(_plumx2.default.selector, _plumx2.default).name; /**
                                                                                                                                                                 * plumx.module.js
                                                                                                                                                                 */

},{"./plumx.component":1}],4:[function(require,module,exports){
'use strict';

var _plumx = require('./js/plumx.module');

var _plumx2 = _interopRequireDefault(_plumx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

app.requires.push('primoStudioPlumX');

},{"./js/plumx.module":3}]},{},[4]);
