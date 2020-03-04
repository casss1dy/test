import $ from "jquery";
import eventEmitter, {ADD, DELETE, VALIDATE} from "../ee";

const $form = {
    change: $('#formChange'),
};

const $btn = {
    delete: $('#deleteProduct'),
    save: $('#saveProduct'),
};

$btn.delete.on('click', function(e) {
    eventEmitter.emit(DELETE, {
      productId: this.dataset.product,
    });
});

$btn.save.on('click', () => {
    let data = $form.change.serializeArray();
    eventEmitter.emit(ADD, {
        data: data,
    });
});

$form.change.on('input focusout', function(e) {
  eventEmitter.emit(VALIDATE, {
    name: e.target.name,
    value : e.target.value,
  });
});

export function toggleValidationError(input, error = '') {
  // debugger;
  let $error = $form.change.find(`label[for=${input}]`);
  let $input = $form.change.find(`#${input}`);

  $error.html(error);
  if (error && !$input.hasClass('invalid-input')) $input.addClass('invalid-input');
  else if (!error && $input.hasClass('invalid-input')) $input.removeClass('invalid-input');
}

export function toggleBtnDisable(btn) {
  console.log(btn);
  let $currentBtn = $btn[btn];
  let isDisable = $currentBtn.prop('disabled');

  $currentBtn.closest('fieldset').prop('disabled', !isDisable);
  $currentBtn.prop('disabled', !isDisable);
  $currentBtn.children('.spinner-grow').toggleClass('d-none');
}
