/*
 * plumx.controller.js
 */

class PrimoStudioPlumxController {

    constructor(angularLoad, studioConfig, $http, $scope, $element, $timeout, $window) {
        this.angularLoad  = angularLoad;
        this.studioConfig = studioConfig;
        this.$http        = $http;
        this.$scope       = $scope;
        this.$element     = $element;
        this.$timeout     = $timeout;
        this.$window      = $window;
    }

    getConfigApiKey() {
        return this.studioConfig[0].apikey || '';
    }

    getConfigISBN() {
        return this.studioConfig[0].isbn || '';
    }

    getConfigWidgetType() {
        return this.studioConfig[0].widgettype || 'print';
    }

    getConfigWidgetTheme() {
        return this.studioConfig[0].widgettheme || 'default';
    }

    $onInit() {

        let vm = this;

        vm.embed_js = '';

        vm.plumx_js  = 'https://d39af2mgp1pqhg.cloudfront.net/widget-';
        vm.plumx_url = '';
        vm.plumx_popup = '';
        vm.plumx_badge = '';

        switch(vm.getConfigWidgetType()) {
            default:
            case 'print':
                vm.plumx_class = 'plumx-plum-print-popup';
                vm.plumx_popup = 'right';
                vm.plumx_js    += 'popup.js';
                break;
            case 'details':
                vm.plumx_class = 'plumx-details';
                vm.plumx_js    += 'details.js';
                break;
            case 'summary':
                vm.plumx_class = 'plumx-summary';
                vm.plumx_js    += 'summary.js';
                break;
            case 'badge':
                vm.plumx_class = 'plumx-plum-print-popup';
                vm.plumx_popup = 'right';
                vm.plumx_badge = 'true';
                vm.plumx_js    += 'popup.js';
                break;
        }
        switch(vm.getConfigWidgetTheme()) {
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
            vm.$timeout(() => {
                vm.plumx_url = 'https://plu.mx/plum/a/?' + vm.api + '=' + vm.doi;
                vm.$http.head(vm.plumx_url).then((res) => {
                    // Get the PlumX script
                    vm.embed_js = vm.plumx_js + '?' + Date.now();
                    vm.angularLoad.loadScript(vm.embed_js).then(() => {
                        // Create our new Primo service
                        let plumxSection = {
                            scrollId: "plumx",
                            serviceName: "plumx",
                            title: "brief.results.tabs.PlumX"
                        };
                        vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, plumxSection);
                    }, (res) => {
                        console.log('plumx loadScript failed: ' + res);
                    });
                }, (res) => {
                    console.log('plumx api failed: ' + res);
                });
            }, 3000);
        }

        // move the plumx widget into the new PlumX service section
        let unbindWatcher = vm.$scope.$watch(() => {
            return vm.parentElement.querySelector('h4[translate="brief.results.tabs.PlumX"]');
        }, (newVal, oldVal) => {
            if (newVal) {
                // Get the section body associated with the value we're watching
                let sectionBody = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
                if (sectionBody && sectionBody.appendChild) {
                    sectionBody.appendChild(vm.$element[0]);
                }
                unbindWatcher();
            }
        });
    }


    $onDestroy() {
        let vm = this;
        let el = null;

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
}

PrimoStudioPlumxController.$inject = [
    'angularLoad',
    'primoStudioPlumxStudioConfig',
    '$http',
    '$scope',
    '$element',
    '$timeout',
    '$window'
];

export default PrimoStudioPlumxController;
