import $ from "jquery";
import * as template from './template_strings';

// Q - вынести в отд файл конфигурации?
const $dom = {
  table: $('#tableProducts'),
  spinner: $('#spinnerLoader'),
  backdrop: $('#pageBackdrop'),
  closeBtn: $('.btn-close'),
  product: {
    // item: $('.product'),
    // name: $('.product-name'),
    deleteBtn: $('#deleteProduct'),
    addBtn: $('#addProduct'),
  },
  modal: {
    view: $('#view'),
    delete: $('#delete'),
    edit: $('#edit'),
  }
};

// spinner => backdrop light => modal => backdrop dark
export function toggleSpinner(isToggleBackdrop = true) {
  if (isToggleBackdrop) toggleBackdrop();
  $dom.backdrop.toggleClass('backdrop-light');
  $dom.spinner.toggleClass('d-none');
}

export function toggleModal(type, isToggleBackdrop = false) {
  if (isToggleBackdrop) toggleBackdrop();
  $dom.modal[type].toggleClass('show');
}

function toggleBackdrop() {
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

export function renderTable(data) {
  let fragment = createHTMLFragment(data, 'tableRow');
  $dom.table.append(fragment);
}

export function renderModalView(data) {
  let arrData = Array.isArray(data) ? data : [data];
  let fragment = createHTMLFragment(arrData, 'productView');

  $dom.modal.view.find('.product-name').text(data.name);
  $dom.modal.view.find('.product-info').html(fragment);
}

export function renderModalDelete(productId) {
  $dom.product.deleteBtn.attr('data-product', productId);
}

function createHTMLFragment(arrData, templateName) {
  let htmlTemplate = template[templateName];
  return arrData.reduce((htmlFragment, obj) => htmlFragment + htmlTemplate(obj), '');
}

// events
import {modalClose, modalOpen, deleteProduct} from './ee';

$dom.table.on('click', '.product', modalOpen);
$dom.product.addBtn.on('click', modalOpen);
$dom.closeBtn.on('click', modalClose);
$dom.product.deleteBtn.on('click', deleteProduct);
// Q - на добавленные элементы

