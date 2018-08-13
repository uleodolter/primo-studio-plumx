/**
 * plumx.module.js
 */

import PrimoStudioPlumxComponent from './plumx.component';

export const PrimoStudioPlumxModule = angular
    .module('primoStudioPlumx', [])
    .component(PrimoStudioPlumxComponent.selector, PrimoStudioPlumxComponent)
    .name;

