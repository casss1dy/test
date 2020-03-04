import $ from "jquery";
import eventEmitter, {OPEN, CLOSE} from "../ee";
import {createHTMLFragment} from '../view';

export default class ModalView {
    constructor(type) {

      let self = this;

      self.$backdrop = $('#pageBackdrop');

      if (type === 'view') return new View();
    }

    toggle(isToggleBackdrop = false) {
      if (isToggleBackdrop) {
        $('body').toggleClass('modal-open');
        this.$backdrop.toggleClass('d-none');
      };
      this.$id.toggleClass('show');
    }

    isOpen(type) {
      return this.$modal[type].hasClass('show');
    }

}

export class View extends ModalView {
  constructor() {
    super();
    this.$id = $('#view');

    console.log('view----');

    $('.btn-close').on('click', () => {
      eventEmitter.emit(CLOSE);
    });
  }

  render(data) {
    this.$id.find('.product-name').text(data.name);
    this.$id.find('.product-info').html(this.template(data));
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