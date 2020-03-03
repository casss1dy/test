import $ from "jquery";
import eventEmitter, {FILTER} from "../ee";

export default class FilterView {
  constructor() {
    this.$form = $('#filterForm');
    this.$btn = this.$form.find('#filterBtn');
    this.$btnReset = this.$form.find('#resetBtn');
    this.$input = this.$form.find('input[name="search"]');

    // Q - нужно ли объединить в один .on на кнопки 
    // и в зависимости от id кнопки передавать строку фильтра
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


