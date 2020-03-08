import $ from "jquery";
import eventEmitter, {CLOSE, RENDER_FORM} from "../ee";

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

      $('.page button, .page input').attr('tabindex', (index, attr) => attr == -1 ? null  : -1);

      this.$modal.toggleClass('show');
      this.$modal.find('input').first().focus();

      console.log(this.$modal);
    }

    isOpen() {
      return !!this.$modal.hasClass('show');
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
    if (!delivery || delivery.country === null || delivery.city === null) deliveryInfo = 'No'; //TODO see

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
