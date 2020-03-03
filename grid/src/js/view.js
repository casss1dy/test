import $ from "jquery";
import * as template from './template_strings';

// Q - нужен ли класс
import FilterView from './views/filter';
export const filterView = new FilterView();

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
  $dom.table.body.html(fragment);
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

export function toggleValidationError(input, error = '') {
  // debugger;
  let $error = $dom.form.add.find(`label[for=${input}]`);
  let $input = $dom.form.add.find(`#${input}`);

  $error.html(error);
  if (error && !$input.hasClass('invalid-input')) $input.addClass('invalid-input');
  else if (!error && $input.hasClass('invalid-input')) $input.removeClass('invalid-input');
}

// events
import {OPEN, CLOSE, DELETE, ADD, VALIDATE, SORT} from './ee';
import eventEmitter from "./ee";


$dom.table.body.on('click', '.product', modalOpen);
$dom.showAddModal.on('click', modalOpen);
$dom.closeBtn.on('click', modalClose);

$dom.table.head.on('click', '.sortable', function() {
  // ? this передавать в контроллер и обратно во вью? или каккой-то id,
  //  а после снова искать элемент с переданным id обратно
  // debugger;
  $dom.table.head.find('.sort').each(function () {
    $(this).removeClass('sort-active');
  });

  let icon = $(this).children('.sort');
  if (!icon.hasClass('sort-active')) icon.addClass('sort-active');

  let oldDirection = this.dataset.sort;
  let direction = oldDirection === 'desc' || !oldDirection ? 'asc' : 'desc';
  this.dataset.sort = direction;

  icon.addClass(`sort-${direction}`);
  icon.removeClass(`sort-${oldDirection}`);

  const options = {
    sort: {
      direction: direction,
      field: this.dataset.field,
    }
  };

  // let filterStr = filterView.getFilterStr();
  if (filterView.filterStr) options.search = filterView.filterStr;

  eventEmitter.emit(SORT, options);
  console.log(this);
});

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

$dom.form.add.on('input focusout', function(e) {
  eventEmitter.emit(VALIDATE, {
    name: e.target.name,
    value : e.target.value,
    // id: e.target.id,
  });
});


// Q - на добавленные элементы (закрытие алерта)

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


