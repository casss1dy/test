import $ from "jquery";


// TODO after document ready
const $dom = {
  backdrop: $('#pageBackdrop'),
};

export function toggleBackdrop() {
  $('body').toggleClass('modal-open');
  $dom.backdrop.toggleClass('d-none');
}










