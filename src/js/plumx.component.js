/*
 * plumx.component.js
 */

import plumxTemplate from '../html/plumx.template.html';
import controller from './plumx.controller';

const PrimoStudioPlumXComponent = {
    selector: 'primoStudioPlumX',
    controller,
    bindings: {parentCtrl: '<'},
    template: plumxTemplate
};

export default PrimoStudioPlumXComponent;
