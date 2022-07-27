(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _plumx = _interopRequireDefault(require("./plumx.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
 * plumx.component.js
 */
var plumxTemplate = "<div id=\"plumx_widget\" ng-if=\"$ctrl.doi\">\n    <a ng-href=\"{{$ctrl.plumx_url}}\"\n       class=\"{{$ctrl.plumx_class}}\"\n       data-size=\"large\"\n       data-popup=\"{{$ctrl.plumx_popup}}\"\n       data-badge=\"{{$ctrl.plumx_badge}}\"\n       data-site=\"plum\"\n       data-hide-when-empty=\"true\"\n       target=\"_blank\">PlumX {{$ctrl.doi}}</a>\n</div>\n";
var PrimoStudioPlumxComponent = {
  selector: 'primoStudioPlumx',
  controller: _plumx["default"],
  bindings: {
    parentCtrl: '<'
  },
  template: plumxTemplate
};
var _default = PrimoStudioPlumxComponent;
exports["default"] = _default;

},{"./plumx.controller":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
 * plumx.controller.js
 */
var PrimoStudioPlumxController = /*#__PURE__*/function () {
  function PrimoStudioPlumxController(angularLoad, studioConfig, $http, $scope, $element, $timeout, $window) {
    _classCallCheck(this, PrimoStudioPlumxController);

    this.angularLoad = angularLoad;
    this.studioConfig = studioConfig;
    this.$http = $http;
    this.$scope = $scope;
    this.$element = $element;
    this.$timeout = $timeout;
    this.$window = $window;
  }

  _createClass(PrimoStudioPlumxController, [{
    key: "getConfigApiKey",
    value: function getConfigApiKey() {
      return this.studioConfig[0].apikey || '';
    }
  }, {
    key: "getConfigISBN",
    value: function getConfigISBN() {
      return this.studioConfig[0].isbn || '';
    }
  }, {
    key: "getConfigWidgetType",
    value: function getConfigWidgetType() {
      return this.studioConfig[0].widgettype || 'print';
    }
  }, {
    key: "getConfigWidgetTheme",
    value: function getConfigWidgetTheme() {
      return this.studioConfig[0].widgettheme || 'default';
    }
  }, {
    key: "$onInit",
    value: function $onInit() {
      var vm = this;
      vm.embed_js = '';
      vm.plumx_js = 'https://d39af2mgp1pqhg.cloudfront.net/widget-';
      vm.plumx_cssid = 'plx-css-';
      vm.plumx_url = '';
      vm.plumx_popup = '';
      vm.plumx_badge = '';

      switch (vm.getConfigWidgetType()) {
        default:
        case 'print':
          vm.plumx_class = 'plumx-plum-print-popup';
          vm.plumx_popup = 'right';
          vm.plumx_js += 'popup.js';
          vm.plumx_cssid += 'popup';
          break;

        case 'details':
          vm.plumx_class = 'plumx-details';
          vm.plumx_js += 'details.js';
          vm.plumx_cssid += 'details';
          break;

        case 'summary':
          vm.plumx_class = 'plumx-summary';
          vm.plumx_js += 'summary.js';
          vm.plumx_cssid += 'summary';
          break;

        case 'badge':
          vm.plumx_class = 'plumx-plum-print-popup';
          vm.plumx_popup = 'right';
          vm.plumx_badge = 'true';
          vm.plumx_js += 'popup.js';
          vm.plumx_cssid += 'popup';
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
      } // the prm-full-view container, our parent is prm-full-view-after


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
          vm.$http.head('https://cors-anywhere.herokuapp.com/' + vm.plumx_url).then(function (_res) {
            // Get the PlumX script
            vm.embed_js = vm.plumx_js + '?' + Date.now();
            vm.angularLoad.loadScript(vm.embed_js).then(function () {
              // Create our new Primo service
              var plumxSection = {
                scrollId: 'plumx',
                serviceName: 'plumx',
                title: 'brief.results.tabs.PlumX'
              };
              vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, plumxSection);
            }, function (res) {
              console.log('plumx loadScript failed: ' + res);
            });
          }, function (res) {
            console.log('plumx api failed: ' + res);
          });
        }, 3000);
      } // move the plumx widget into the new PlumX service section


      var unbindWatcher = vm.$scope.$watch(function () {
        return vm.parentElement.querySelector('h4[translate="brief.results.tabs.PlumX"]');
      }, function (newVal, _oldVal) {
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
    key: "$onDestroy",
    value: function $onDestroy() {
      var vm = this;
      var el = null;

      if (vm.$window.__plumX) {
        delete vm.$window.__plumX;
      } // remove css/js
      // http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml


      el = document.body.querySelector('[src="' + vm.embed_js + '"]');

      if (el) {
        el.remove();
      }

      el = document.head.querySelector('link[id="' + vm.plumx_cssid + '"]');

      if (el) {
        el.remove();
      }

      document.head.querySelectorAll('script').forEach(function (script) {
        if (script.src.endsWith('jquery/1.10.2/jquery.min.js') || script.src.endsWith('extjs/xss.js')) {
          script.parentNode.removeChild(script);
        }
      });
    }
  }]);

  return PrimoStudioPlumxController;
}();

PrimoStudioPlumxController.$inject = ['angularLoad', 'primoStudioPlumxStudioConfig', '$http', '$scope', '$element', '$timeout', '$window'];
var _default = PrimoStudioPlumxController;
exports["default"] = _default;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrimoStudioPlumxModule = void 0;

var _plumx = _interopRequireDefault(require("./plumx.component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * plumx.module.js
 */
var PrimoStudioPlumxModule = angular.module('primoStudioPlumx', []).component(_plumx["default"].selector, _plumx["default"]).name;
exports.PrimoStudioPlumxModule = PrimoStudioPlumxModule;

},{"./plumx.component":1}],4:[function(require,module,exports){
"use strict";

var _plumx = require("./js/plumx.module");

/**
 * main.js
 */
app.requires.push(_plumx.PrimoStudioPlumxModule);

},{"./js/plumx.module":3}]},{},[4]);
