import $ from "jquery";
import * as template from './views/template';

// Q
import FilterView from './views/filter';
export const filterView = new FilterView();

import ModalView from './views/modal';
export const modalView = new ModalView();

// import {toggleValidationError} from './views/form';

// TODO after document ready
const $dom = {
  table: {
    head: $('#tableProducts thead'),
    body: $('#tableProducts tbody'),
  },
  spinner: $('#spinnerLoader'),
  backdrop: $('#pageBackdrop'),
  closeBtn: $('.btn-close'),
  showAddModal: $('#showAddModal'), // show add modal
  product: {
    // item: $('.product'),
    // name: $('.product-name'),
    deleteBtn: $('#deleteProduct'),
    saveBtn: $('#saveProduct'),
  },
  modal: {
    view: $('#view'),
    delete: $('#delete'),
    edit: $('#edit'),
  },
  form: {
    add: $('#formChange'),
  },
};


export function toggleBackdrop() {
  $('body').toggleClass('modal-open');
  $dom.backdrop.toggleClass('d-none');
}

export class Alert {
  constructor(alert) {
    this.fragment = createHTMLFragment([alert], 'alert');
  }

  show() {
    $(this.fragment).appendTo('body');
  }
}

// export function renderTable(data) {
//   let fragment = createHTMLFragment(data, 'tableRow');
//   $dom.table.body.html(fragment);
// }

export function renderModalDelete(productId) {
  $dom.product.deleteBtn.attr('data-product', productId);
}

// utilites ?
export function createHTMLFragment(arrData, templateName) {
  let htmlTemplate = template[templateName];
  return arrData.reduce((htmlFragment, obj) => htmlFragment + htmlTemplate(obj), '');
}

// events
import {SORT} from './ee';
import eventEmitter from "./ee";



$dom.showAddModal.on('click', modalView.open);






