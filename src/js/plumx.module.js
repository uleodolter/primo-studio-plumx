/**
 * plumx.module.js
 */

import PrimoStudioPlumXComponent from './plumx.component';

export const PrimoStudioPlumXModule = angular
    .module('primoStudioPlumX', [])
        .component(PrimoStudioPlumXComponent.selector, PrimoStudioPlumXComponent)
        .name;

