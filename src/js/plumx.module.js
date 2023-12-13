/**
 * plumx.module.js
 */

import PrimoStudioPlumxComponent from './plumx.component.js';

export const PrimoStudioPlumxModule = angular
    .module('primoStudioPlumx', [])
    .component(PrimoStudioPlumxComponent.selector, PrimoStudioPlumxComponent)
    .name;
