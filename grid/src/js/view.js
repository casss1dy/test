import $ from "jquery";
import * as template from './template_strings';

// TODO after document ready
const $dom = {
  table: $('#tableProducts'),
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
    add: $(document.forms.add), // ?
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

export function isModalOpen(type) {
  return $dom.modal[type].hasClass('show');
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
  $dom.table.html(fragment);
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

export function toggleBtnDisable(btn) {
  let $btn = $dom.product[btn];
  let isDisable = $btn.prop('disabled');

  $btn.closest('fieldset').prop('disabled', !isDisable);
  $btn.prop('disabled', !isDisable);
  $btn.children('.spinner-grow').toggleClass('d-none');
}

// events
import {OPEN, CLOSE, DELETE, ADD} from './ee';
import eventEmitter from "./ee";

$dom.table.on('click', '.product', modalOpen);
$dom.showAddModal.on('click', modalOpen);
$dom.closeBtn.on('click', modalClose);

$dom.product.deleteBtn.on('click', function(e) {
  eventEmitter.emit(DELETE, {
    productId: this.dataset.product,
  });
});

$dom.product.saveBtn.on('click', () => {
  // let formData = new FormData(document.forms.add);

  let data = $dom.form.add.serializeArray();

  eventEmitter.emit(ADD, {
    data: data,
  });
});

// Q - на добавленные элементы

function modalOpen(e) {
  let modalId = $(e.target).data('modal');
  if (modalId === undefined) return;

  eventEmitter.emit(OPEN, {
    modalId: modalId,
    productId: this.id || null,
  });
}

function modalClose() {
  let dismiss = $(this).data('dismiss');
  eventEmitter.emit(CLOSE, {
    modal: $(this).closest('.' + dismiss).data('action'),
  });
}


