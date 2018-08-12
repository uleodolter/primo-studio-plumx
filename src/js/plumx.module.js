/**
 * plumx.module.js
 */

import PrimoStudioPlumxComponent from './plumx.component';

export const PrimoStudioPlumxModule = angular
    .module('primoStudioPlumx', [])
        .component(PrimoStudioPlumxComponent.selector, PrimoStudioPlumxComponent)
        .config([ '$sceDelegateProvider', ($sceDelegateProvider) => {
            let whitelist = $sceDelegateProvider.resourceUrlWhitelist();
            $sceDelegateProvider.resourceUrlWhitelist( whitelist.concat([
                'https://plu.mx/plum/a/**'
            ]));
        }])
        .name;

