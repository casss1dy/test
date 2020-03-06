import $ from "jquery";
import eventEmitter, {CLOSE} from "../ee";

export default class ModalView {
    constructor(type) {
      let self = this;
      self.$backdrop = $('#pageBackdrop');

      let modalView;
      if (type === 'view') modalView = new View();
      if (type === 'delete') modalView = new Delete();
      if (type === 'change') modalView = new Change();

      return modalView;
    }

    toggle(isToggleBackdrop = false) {
      if (isToggleBackdrop) {
        $('body').toggleClass('modal-open');
        this.$backdrop.toggleClass('d-none');
      }

      // debugger;

      this.$modal.toggleClass('show');
      this.$modal.find('input').first().focus();
    }

}

export class View extends ModalView {
  constructor() {
    super();
    this.$modal = $('#view');

    this.$modal.on('click', '.btn-close', () => {
      eventEmitter.emit(CLOSE, {modal: this.$modal.attr('id')});
    });
  }

  render(data) {
    this.$modal.find('.product-name').text(data.name);
    this.$modal.find('.product-info').html(this.template(data));
  }

  template({email, count, price, delivery}) {
    let deliveryInfo;
    if (!delivery || delivery.country === null && delivery.city === null) deliveryInfo = 'No'; //TODO see
    else if (Array.isArray(delivery.city))
      deliveryInfo = `${delivery.country} / ${delivery.city.join(', ')}`;

    const template = `<tr>
          <th width="150">Count</th>
          <td>${count}</td>
      </tr>
      <tr>
          <th>Supplier email</th>
          <td><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
          <th>Price</th>
          <td>${price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
      </tr>
      <tr>
          <th>Delivery</th>
          <td>${deliveryInfo}</td>
      </tr>`;

    return template;
  }
}

export class Change extends ModalView {
  constructor() {
    super();
    this.$modal = $('#change');

    this.$modal.on('click', '.btn-close', () => {
      eventEmitter.emit(CLOSE, {modal: this.$modal.attr('id')});
    });
  }

  render(data) {
    this.$modal.find('.modal-content').html(this.template(data));
    this.$modal.find('input').first().focus();
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
}

export class Delete extends ModalView {
  constructor() {
    super();
    this.$modal = $('#delete');
    this.$deleteBtn = $('#deleteProduct');

    this.$modal.on('click', '.btn-close', () => {
      eventEmitter.emit(CLOSE, {modal: this.$modal.attr('id')});
    });
  }

  render(data) {
    this.$modal.find('.modal-content').html(this.template(data));
  }

  template(data) {
    const template = `<div class="modal-header">
        <h5 class="modal-title">Confirm delete</h5>
        <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
      Are you sure you want to delete <b>${data.name}</b>?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light btn-close" data-dismiss="modal">Close</button>
      <button class="btn btn-danger" type="button" id="deleteProduct" data-product="${data.id}">
        <span class="spinner-grow spinner-grow-sm d-none" role="status" aria-hidden="true"></span>
        Delete
      </button>
    </div>`;

    return template;
  }
}
