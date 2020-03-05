import $ from "jquery";
import eventEmitter, {OPEN, CLOSE} from "../ee";
import {createHTMLFragment} from '../view';

export default class ModalView {
    constructor(type) {
      let self = this;
      self.$backdrop = $('#pageBackdrop');

      console.log(type);
      let modalView;
      if (type === 'view') modalView = new View();
      if (type === 'delete') modalView = new Delete();
      if (type === 'change') modalView = new Change();

      return modalView;
    }

    toggle(isToggleBackdrop = false) {
      console.log('toggle');
      if (isToggleBackdrop) {
        $('body').toggleClass('modal-open');
        this.$backdrop.toggleClass('d-none');
      }
      this.$modal.toggleClass('show');
    }

    isOpen(type) {
      return this.$modal[type].hasClass('show');
    }

}

export class View extends ModalView {
  constructor() {
    super();
    this.$modal = $('#view');

    this.$modal.find('.btn-close').on('click', () => {
      eventEmitter.emit(CLOSE, {modal: this.$modal.attr('id')});
    });
  }

  render(data) {
    this.$modal.find('.product-name').text(data.name);
    this.$modal.find('.product-info').html(this.template(data));
  }

  template({email, count, price, delivery}) {
    let deliveryInfo;
    if (delivery.country === null && delivery.city === null) deliveryInfo = 'No'; //TODO see
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

export class Delete extends ModalView {
  constructor() {
    super();
    this.$modal = $('#delete');
    this.$deleteBtn = $('#deleteProduct');

    this.$modal.find('.btn-close').on('click', () => {
      eventEmitter.emit(CLOSE, {modal: this.$modal.attr('id')});
    });
  }

  render(data) {
    this.$modal.find('.product-name').text(data.name);
    this.$modal.find('.product-info').html(this.template(data));
  }

  setId(id) {
    this.$deleteBtn.attr('data-product', id);
  }

  template() {
  }
}
