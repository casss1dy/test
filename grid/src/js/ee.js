import $ from "jquery";
import ee from "event-emitter";

export const eventEmitter = ee();

// Q - как правильно разделить

export function modalOpen(e) {
  let modalId = $(e.target).data('modal');
  if (modalId === undefined) return;

  eventEmitter.emit('modalOpen', {
    modalId: modalId,
    productId: this.id,
  });
}

export function modalClose() {
  let dismiss = $(this).data('dismiss');
  eventEmitter.emit('modalClose', {
    $modal: $(this).closest('.' + dismiss),
  });
}

export function deleteProduct() {
  eventEmitter.emit('deleteProduct', {
    productId: this.id,
  });
}


