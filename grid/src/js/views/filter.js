import $ from "jquery";
import eventEmitter, {FILTER} from "../ee";

export default class FilterView {
  constructor() {
    this.$btn = $('#filterBtn');
    this.$btnReset = $('#resetBtn');
    this.$form = $('#filterForm');
    this.$input = this.$form.find('input[name="search"]');

    this.$btn.on('click', () => {
      console.log(this.filterStr);
      eventEmitter.emit(FILTER, {filter: this.filterStr});
    });

    this.$btnReset.on('click', () => {
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


