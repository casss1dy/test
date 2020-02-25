import $ from "jquery";
import ee from "event-emitter";

export const eventEmitter = ee();

// Q - как правильно разделить, выносить только eventEmitter.emit?

export function modalOpen(e) {
  let modalId = $(e.target).data('modal');
  if (modalId === undefined) return;

  eventEmitter.emit('modalOpen', {
    modalId: modalId,
    productId: this.id || null,
  });
}

export function modalClose() {
  let dismiss = $(this).data('dismiss');
  eventEmitter.emit('modalClose', {
    modal: $(this).closest('.' + dismiss).data('action'),
  });
}

export function deleteProduct(e) {
  console.log(this.dataset.product);
  eventEmitter.emit('deleteProduct', {
    productId: this.dataset.product,
  });
}


