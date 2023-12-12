/**
 * plumx.module.js
 */

import PrimoStudioPlumxComponent from './plumx.component';

export const PrimoStudioPlumxModule = angular
    .module('primoStudioPlumx', [])
    .component(PrimoStudioPlumxComponent.selector, PrimoStudioPlumxComponent)
    .config(['$sceDelegateProvider', ($sceDelegateProvider) => {
        let whitelist = $sceDelegateProvider.trustedResourceUrlList();
        $sceDelegateProvider.trustedResourceUrlList(whitelist.concat([
            'https:/plu.mx/**'
        ]));
    }])
    .name;

