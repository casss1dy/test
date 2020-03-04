import $ from "jquery";

export default class spinnerView {
  constructor() {
    this.$spinner = $('#spinnerLoader');
    this.$backdrop = $('#pageBackdrop');
  }

  toggle(isToggleBackdrop) {
    
    if (isToggleBackdrop) {
      $('body').toggleClass('modal-open');
      this.$backdrop.toggleClass('d-none');
    };

    this.$backdrop.toggleClass('backdrop-light');
    this.$spinner.toggleClass('d-none');
  }
}
