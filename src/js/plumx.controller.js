/*
 * plumx.controller.js
 */

class PrimoStudioPlumxController {

    constructor(angularLoad, studioConfig, $http, $scope, $element, $timeout, $window) {
        this.angularLoad  = angularLoad;
        this.studioConfig = studioConfig;
        this.$http = $http;
        this.$scope = $scope;
        this.$element = $element;
        this.$timeout = $timeout;
        this.$window = $window;
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

        vm.plumx_js    = 'https://cdn.plu.mx/widget-';
        vm.plumx_cssid = 'plx-css-';
        vm.plumx_url   = '';
        vm.plumx_popup = '';
        vm.plumx_badge = '';

        switch(vm.getConfigWidgetType()) {
        default:
        case 'print':
            vm.plumx_class = 'plumx-plum-print-popup';
            vm.plumx_popup = 'right';
            vm.plumx_js    += 'popup.js';
            vm.plumx_cssid += 'popup';
            break;
        case 'details':
            vm.plumx_class = 'plumx-details';
            vm.plumx_js    += 'details.js';
            vm.plumx_cssid += 'details';
            break;
        case 'summary':
            vm.plumx_class = 'plumx-summary';
            vm.plumx_js    += 'summary.js';
            vm.plumx_cssid += 'summary';
            break;
        case 'badge':
            vm.plumx_class = 'plumx-plum-print-popup';
            vm.plumx_popup = 'right';
            vm.plumx_badge = 'true';
            vm.plumx_js    += 'popup.js';
            vm.plumx_cssid += 'popup';
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
                vm.plumx_api = 'https://api.plu.mx/widget/other/artifact?type=' + vm.api + '&id=' + vm.doi + '&site=plum';
                vm.$http.get('https://corsproxy.io/?' + vm.plumx_api, {
                    headers : {'Accept' : 'application/json'}
                }).then((res) => {
                    if (res.status == 200 && !('error_code' in res.data)) {
                        vm.plumx_url = 'https://plu.mx/plum/a/?' + vm.api + '=' + vm.doi;
                        // Get the PlumX script
                        vm.embed_js = vm.plumx_js + '?' + Date.now();
                        vm.angularLoad.loadScript(vm.embed_js).then(() => {
                        // Create our new Primo service
                            let plumxSection = {
                                scrollId: 'plumx',
                                serviceName: 'plumx',
                                title: 'brief.results.tabs.PlumX'
                            };
                            vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, plumxSection);
                        }, (err) => {
                            console.log('plumx loadScript failed: ' + err);
                        });
                    }
                }, (err) => {
                    console.log('plumx api failed: ' + err);
                });
            }, 3000);
        }

        // move the plumx widget into the new PlumX service section
        let unbindWatcher = vm.$scope.$watch(() => {
            return vm.parentElement.querySelector('h4[translate="brief.results.tabs.PlumX"]');
        }, (newVal, _oldVal) => {
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
        // http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml
        el = vm.$window.document.body.querySelector('[src="' + vm.embed_js + '"]');
        if (el) {
            el.remove();
        }

        el = vm.$window.document.head.querySelector('link[id="' + vm.plumx_cssid + '"]');
        if (el) {
            el.remove();
        }

        vm.$window.document.head.querySelectorAll('script').forEach((script) => {
            if (script.src.endsWith('jquery/1.10.2/jquery.min.js') ||
                script.src.endsWith('extjs/xss.js')) {
                script.parentNode.removeChild(script);
            }
        });
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
