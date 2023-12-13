/*
 * plumx.component.js
 */

import plumxTemplate from '../html/plumx.template.html';
import controller from './plumx.controller.js';

const PrimoStudioPlumxComponent = {
    selector: 'primoStudioPlumx',
    controller,
    bindings: {parentCtrl: '<'},
    template: plumxTemplate
};

export default PrimoStudioPlumxComponent;
