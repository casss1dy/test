import $ from "jquery";
import eventEmitter, {ADD, DELETE, VALIDATE} from "../ee";

export default class FormView {
  constructor() {
    let self = this;

    $('body').on('click', '#saveProduct', () => self.triggerSaveProduct());
    $('body').on('input focusout', '#formChange', (e) => self.triggerValidate(e));
    $('body').on('click', '#deleteProduct', (e) => self.triggerDeleteProduct(e));

    this.delivery = {
      country: ['Russia', 'Japan'],
      cities: [['Saratov', 'Moscow'], ['Osaka', 'Tokyo']],
    }
  }

  init() {
    let self = this;

    // if ($('#formChange').length) self.$formChange = $('#formChange');
    if ($('#deleteProduct').length) self.$deleteBtn = $('#deleteProduct');
    // if ($('#saveProduct').length) self.$saveBtn = $('#saveProduct');
  }

  render($modal, data) {
    let self = this;

    $modal.find('.modal-content').html(this.template(data));
    $modal.find('input').first().focus();

    self.$formChange = $('#formChange');
    self.$saveBtn = $('#saveProduct');
  }

  template({id, name, email, count, price, delivery}) {
    console.log(delivery);

    let hasDelivery;
    if (delivery && delivery.country !== null) hasDelivery = true;

    const template = `        
    <div class="modal-header">
      <h5 class="modal-title"> ${id ? 'Edit' : 'Add'} </h5>
      <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form action="" class="form" name="add" id="formChange">
        <fieldset>
          <div class="form-group form-row">
            <div class="col-7">
              <input type="text" class="form-control" name="name" id="name" placeholder="Your name" value="${id ? name : ''}">
            </div>
            <div class="col align-self-center">
              <label class="invalid-message" for="name"></label>
            </div>
          </div>
          <div class="form-group form-row">
            <div class="col-7">
              <input type="email" class="form-control" name="email" id="email" placeholder="Supplier email" value="${id ? email : ''}">
            </div>
            <div class="col align-self-center">
              <label class="invalid-message" for="email"></label>
            </div>
          </div>
          <div class="form-group form-row">
            <div class="col-5">
              <input type="number" class="form-control" name="count" id="count" placeholder="Count" min = "0" value="${id ? count : ''}">
            </div>
            <div class="col align-self-center">
              <label class="invalid-message" for="count"></label>
            </div>
          </div>
          <div class="form-group form-row">
            <div class="col-5">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroupPrepend">$</span>
                </div>
                <input type="number" class="form-control" name="price" id="price" placeholder="Price" value="${id ? price : ''}">
              </div>
            </div>
            <div class="col align-self-center">
              <label class="invalid-message" for="price"></label>
            </div>
          </div>
          <div class="form-group form-row">
            <div class="col-7">
              <select class="form-control" id="delivery">
                <option ${!hasDelivery ? 'selected' : ''}>None delivery</option>
                <option value="country" ${hasDelivery ? 'selected' : ''}>Country</option>
                <option value="city">City</option>
              </select>
            </div>
          </div>
          <div class="form-group form-row ${!hasDelivery ? 'd-none' : ''}">
            <div class="col-7">
              <fieldset class="form-fieldset">
                <legend class="form-legend">Country</legend>
                <div class="custom-control custom-radio">
                  <input class="custom-control-input" type="radio" name="country" id="Russia" value="Russia" ${hasDelivery && delivery.country === 'Russia' ? 'checked' : ''}>
                  <label class="custom-control-label" for="Russia"> Russia </label>
                </div>
                <div class="custom-control custom-radio">
                  <input class="custom-control-input" type="radio" name="country" id="Japan" value="Japan" ${hasDelivery && delivery.country === 'Japan' ? 'checked' : ''}>
                  <label class="custom-control-label" for="Japan"> Japan </label>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="form-group d-none">
            <fieldset class="form-fieldset">
              <legend class="form-legend">City</legend>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" name="city[]" id="saratov" value="saratov" checked>
                <label class="custom-control-label" for="saratov">Saratov</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" name="city[]" id="moscow" value="moscow">
                <label class="custom-control-label" for="moscow">Moscow</label>
              </div>
            </fieldset>
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group mb-0">
            <button class="btn btn-success" type="button" id="saveProduct" data-product="${id ? id : ''}">
              <span class="spinner-grow spinner-grow-sm d-none" role="status" aria-hidden="true"></span>
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>`;

    return template;
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

  toggleBtnDisable($btn, productId = null) {
    console.log($btn);

    let isDisable = $btn.prop('disabled');

    $btn.closest('fieldset').prop('disabled', !isDisable);
    $btn.prop('disabled', !isDisable);
    $btn.children('.spinner-grow').toggleClass('d-none');

    if (productId) {
      $(`#tableProducts #${productId}`).find('button').prop('disabled', true);
    }
  }

  triggerSaveProduct() {
    let self = this;

    if (!self.$saveBtn) self.init();
    let data = self.$formChange.serializeArray();

    let product = self.$saveBtn.attr('data-product') ? self.$saveBtn.attr('data-product') : null;

    eventEmitter.emit(ADD, {data, product});
  }

  triggerDeleteProduct(e) {
    eventEmitter.emit(DELETE, {
      productId: e.target.dataset.product,
    });
  }

  triggerValidate(e) {
    eventEmitter.emit(VALIDATE, [{
      name: e.target.name,
      value : e.target.value,
    }]);
  }

}
