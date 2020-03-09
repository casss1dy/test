import $ from "jquery";
import eventEmitter, {ADD, DELETE, VALIDATE} from "../ee";

export default class FormView {
  constructor() {
    let self = this;

    $('body').on('click', '#saveProduct', () => self.triggerSaveProduct());
    $('body').on('input focusout', '#formChange', (e) => {
      const noFocusout = ['delivery', 'country', 'city'];
      if (e.type === 'focusout' && (noFocusout.includes(e.target.name))) e.stopImmediatePropagation();
      else self.triggerValidate(e)
    });
    $('body').on('click', '#deleteProduct', (e) => self.triggerDeleteProduct(e));
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

    // $modal.find('button').first().focus();

    self.$formChange = $('#formChange');
    self.$saveBtn = $('#saveProduct');

    self.$delivery = self.$formChange.find('#delivery');
    self.$country = self.$formChange.find('#country');
    self.$countryList = self.$formChange.find('#country-list');
    self.$city = self.$formChange.find('#city');
    self.$cityList = self.$formChange.find('#city-list');

    // self.$delivery.on('change', () => self.triggerDeliveryChange());

    // sessionStorage.delivery = JSON.stringify(deliveryAll);
  }

  updateCityList(cityList) {
    let self = this;
    self.$cityList.html(cityList);
  }

  // getDeliveryInfo(delivery) {
  //   let self = this;
  //   const deliveryAll = JSON.parse(sessionStorage.delivery);
  //
  //   if ($.isEmptyObject(delivery) || delivery.country === null) {
  //     delivery = {
  //       country: deliveryAll.country[0],
  //       city: ['Moscow'],
  //     };
  //   }
  //
  //   let i = deliveryAll.country.indexOf(delivery.country);
  //
  //   const countryList = deliveryAll.country.map(item => self.templateCountry(item, delivery.country)).join('');
  //
  //   const cityList = Object.keys(deliveryAll.city[i]).map(item => {
  //     let checked;
  //
  //     if (delivery.city) {
  //       checked = ~$.inArray(item, delivery.city) ? 'checked' : '';
  //       if (checked) deliveryAll.city[i][item] = true;
  //     } else {
  //       checked = deliveryAll.city[i][item] ? 'checked' : '';
  //     }
  //
  //     return self.templateCity(item, checked);
  //   }).join('');
  //
  //   sessionStorage.delivery = JSON.stringify(deliveryAll);
  //
  //   return {countryList, cityList};
  // }

  templateCountry(country, deliveryCountry = null) {
    return `<div class="custom-control custom-radio">
              <input class="custom-control-input" type="radio" name="country" id="${country}" value="${country}" ${country === deliveryCountry ? 'checked' : ''}>
              <label class="custom-control-label" for="${country}"> ${country} </label>
            </div>`;
  }

  templateCity(city, checked) {
    return `<div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" name="city" id="${city}" value="${city}" ${checked}>
              <label class="custom-control-label" for="${city}">${city}</label>
            </div>`;
  }

  changeDelivery() {
    let self = this;

    let selected = self.$delivery.find(':selected').val();
    let country = self.$country.find(':checked').val();

    if (selected === 'country') {
      self.$city.hide();
      self.$country.fadeIn();

      let cityList = {};
      self.$cityList.find(':checkbox').each(function () {
        cityList[this.value] = this.checked;
      });

      return {cityList, country};

    } else if (selected === 'city') {
      self.$country.hide();
      self.$city.fadeIn();

      return {country};
    } else {
      self.$country.fadeOut();
      self.$city.fadeOut();
    }

  }
  // triggerDeliveryChange() {
  //   let self = this;
  //   let selected = self.$delivery.find(':selected').val();
  //   let country = self.$country.find(':checked').val();
  //
  //   if (selected === 'country') {
  //     self.$city.hide();
  //     self.$country.fadeIn();
  //
  //     let deliveryAll = JSON.parse(sessionStorage.delivery);
  //     let countryId = deliveryAll.country.indexOf(country);
  //
  //     self.$cityList.find(':checkbox').each((i, el) => {
  //       // if (deliveryAll.city[countryId][el.value]) {
  //         deliveryAll.city[countryId][el.value] = el.checked;
  //       // }
  //     });
  //
  //     sessionStorage.delivery = JSON.stringify(deliveryAll);
  //
  //   } else if (selected === 'city') {
  //     self.$country.hide();
  //
  //     let deliveryTemplate = self.getDeliveryInfo({country: country});
  //     self.$cityList.html(deliveryTemplate.cityList);
  //
  //     self.$city.fadeIn();
  //   } else {
  //     self.$country.fadeOut();
  //     self.$city.fadeOut();
  //   }
  // }

  template({id, name, email, count, price, delivery, deliveryTemplate}) {
    let self = this;

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
              <select class="form-control" id="delivery" name="delivery">
                <option value="null" ${!hasDelivery ? 'selected' : ''}>None delivery</option>
                <option value="country" ${hasDelivery ? 'selected' : ''}>Country</option>
                <option value="city">City</option>
              </select>
            </div>
          </div>
          <div class="form-group form-row">
            <div class="col-7">
              <fieldset class="form-fieldset" id="country" ${!hasDelivery ? 'style = "display: none"' : ''}>
                <legend class="form-legend">Country</legend>
                <div id="country-list">${deliveryTemplate.countryList}</div>
              </fieldset>
              
              <fieldset class="form-fieldset" id="city" style = "display: none">
                <legend class="form-legend">City</legend>
                <div id="city-list">${deliveryTemplate.cityList}</div>
              </fieldset>
            </div>
            
            <div class="col align-self-center">
              <label class="invalid-message" for="city"></label>
            </div>
            
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

  setInvalidFocus() {
    let self = this;
    self.$formChange.find('.invalid-input').first().focus();
  }

  toggleValidationError(input, error = '') {
    let self = this;

    self.$formChange = $('#formChange');

    // debugger;
    let $error = self.$formChange.find(`label[for=${input}]`);
    let $input = self.$formChange.find(`#${input}`);

    $error.html(error);

    if (error && !$input.hasClass('invalid-input')) $input.addClass('invalid-input');
    else if (!error && $input.hasClass('invalid-input')) $input.removeClass('invalid-input');
  }

  toggleBtnDisable($btn, productId = null) {
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
