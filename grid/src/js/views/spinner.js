import $ from "jquery";
import {toggleBackdrop} from '../view';

const $dom = {
  spinner: $('#spinnerLoader'),
  backdrop: $('#pageBackdrop'),
};

export function toggleSpinner(isToggleBackdrop = true) {
  if (isToggleBackdrop) toggleBackdrop();
  $dom.backdrop.toggleClass('backdrop-light');
  $dom.spinner.toggleClass('d-none');
}
