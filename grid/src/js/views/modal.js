import $ from "jquery";
import eventEmitter, {OPEN, CLOSE} from "../ee";
import {toggleBackdrop, createHTMLFragment} from '../view';

export default class ModalView {
    constructor() {
      this.$modal = {
        view: $('#view'),
        delete: $('#delete'),
        edit: $('#edit'),
      }

      this.$btn = {
        delete: $('#deleteProduct'),
        save: $('#saveProduct'),
      }
    }

    toggle(type, isToggleBackdrop = false) {
      if (isToggleBackdrop) toggleBackdrop(); // ??
      this.$modal[type].toggleClass('show');
    }

    isOpen(type) {
      return this.$modal[type].hasClass('show');
    }

    renderModalView(data) {
      let arrData = Array.isArray(data) ? data : [data];
      let fragment = createHTMLFragment(arrData, 'productView');
    
      this.$modal.view.find('.product-name').text(data.name);
      this.$modal.view.find('.product-info').html(fragment);
    }

    open(e) {
      let modalId = $(e.target).data('modal');
      if (modalId === undefined) return;
    
      eventEmitter.emit(OPEN, {
        modalId: modalId,
        productId: this.id || null,
      });
    }
    
    close() {
      let dismiss = $(this).data('dismiss');
      eventEmitter.emit(CLOSE, {
        modal: $(this).closest('.' + dismiss).data('action'),
      });
    }
}