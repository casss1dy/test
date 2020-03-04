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

//
export function createHTMLFragment(arrData, templateName) {
  let htmlTemplate = template[templateName];
  return arrData.reduce((htmlFragment, obj) => htmlFragment + htmlTemplate(obj), '');
}

// events
import {SORT} from './ee';
import eventEmitter from "./ee";


$dom.table.body.on('click', '.product', modalView.open);
$dom.showAddModal.on('click', modalView.open);
$dom.closeBtn.on('click', modalView.close);

// $dom.table.head.on('click', '.sortable', function() {
//   // Q - this передавать в контроллер и обратно во вью? или каккой-то id,
//   //  а после снова искать элемент с переданным id обратно
//   // debugger;
//   $dom.table.head.find('.sort').each(function () {
//     $(this).removeClass('sort-active');
//   });
//
//   let icon = $(this).children('.sort');
//   if (!icon.hasClass('sort-active')) icon.addClass('sort-active');
//
//   let oldDirection = this.dataset.sort;
//   let direction = oldDirection === 'desc' || !oldDirection ? 'asc' : 'desc';
//   this.dataset.sort = direction;
//
//   icon.addClass(`sort-${direction}`);
//   icon.removeClass(`sort-${oldDirection}`);
//
//   const options = {
//     sort: {
//       direction: direction,
//       field: this.dataset.field,
//     }
//   };
//
//   // let filterStr = filterView.getFilterStr();
//   if (filterView.filterStr) options.search = filterView.filterStr;
//
//   eventEmitter.emit(SORT, options);
//   console.log(this);
// });





