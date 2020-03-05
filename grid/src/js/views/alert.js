import $ from "jquery";

export default class alertView {
  constructor() {
    this.$alert = $('#alert');
  }

  show(e) {
    this.$alert.html(this.template(e));
    this.$alert.fadeIn();

    setTimeout(() => this.$alert.fadeOut(), 5000);
  }

  template(error) {
    const template = `<strong> ${error} </strong><br> Pls try again later`;
    return template;
  }
}