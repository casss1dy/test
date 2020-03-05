import $ from "jquery";
import eventEmitter, {ADD, DELETE, VALIDATE} from "../ee";

export default class FormView {
  constructor() {
    let self = this;

    $('body').on('click', '#saveProduct', (e) => self.triggerSaveProduct(e));
    $('body').on('input focusout', '#formChange', (e) => self.triggerValidate(e));
    $('body').on('click', '#deleteProduct', (e) => self.triggerDeleteProduct(e));

  }

  init() {
    let self = this;

    if ($('#formChange').length) self.$formChange = $('#formChange');
    if ($('#deleteProduct').length) self.$deleteBtn = $('#deleteProduct');
    if ($('#saveProduct').length) self.$saveBtn = $('#saveProduct');
  }

  toggleValidationError(input, error = '') {
    let self = this;

    self.$formChange = $('#formChange');

    console.log(input, error);
    // debugger;
    let $error = self.$formChange.find(`label[for=${input}]`);
    let $input = self.$formChange.find(`#${input}`);
  
    $error.html(error);

    if (error && !$input.hasClass('invalid-input')) $input.addClass('invalid-input');
    else if (!error && $input.hasClass('invalid-input')) $input.removeClass('invalid-input');
  }

  toggleBtnDisable($btn) {
    console.log($btn);

    let isDisable = $btn.prop('disabled');
  
    $btn.closest('fieldset').prop('disabled', !isDisable);
    $btn.prop('disabled', !isDisable);
    $btn.children('.spinner-grow').toggleClass('d-none');
  }

  triggerSaveProduct() {
    let self = this;

    let data = self.$formChange.serializeArray();
    eventEmitter.emit(ADD, { data: data });
  }

  triggerDeleteProduct(e) {
    eventEmitter.emit(DELETE, { 
      productId: e.target.dataset.product, 
    });
  }

  triggerValidate(e) {
    console.log(e.target.name, e.target.value);
    eventEmitter.emit(VALIDATE, {
      name: e.target.name,
      value : e.target.value,
    });
  }

}
