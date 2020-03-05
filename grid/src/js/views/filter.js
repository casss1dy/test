import $ from "jquery";
import eventEmitter, {FILTER} from "../ee";

export default class FilterView {
  constructor() {
    let self = this;
    
    self.$form = $('#filterForm');
    self.$btn = this.$form.find('#filterBtn');
    self.$btnReset = this.$form.find('#resetBtn');
    self.$input = this.$form.find('input[name="search"]');

    self.$btn.on('click', () => {
      eventEmitter.emit(FILTER, {filter: self.filterStr});
    });

    self.$btnReset.on('click', () => {
      eventEmitter.emit(FILTER, {filter: ''});
    });
  }

  get filterStr() {
    return this.$input.val();
  }

  set filterStr(str) {
    this.$input.val(str);
  }

  toggleResetBtn() {
    if (this.filterStr) this.$btnReset.fadeIn();
    else this.$btnReset.fadeOut();
  }
}


