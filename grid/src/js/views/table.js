import $ from "jquery";
import {tableRow} from "./template";
import eventEmitter, {LOAD, SORT} from "../ee";
import {filterView} from "../view";

export default class TableView {
  constructor() {
    $(() => {
      eventEmitter.emit(LOAD);
    });
  }

  init() {
    const $table = $('#tableProducts');
    let self = this;
    self.$thead = $table.find('thead');
    self.$tbody = $table.find('tbody');

    self.$thead.on('click', '.sortable', function() {
      // TODO - убрать лишнее в контроллер
      // debugger;
      self.$thead.find('.sort').each(function () {
        $(this).removeClass('sort-active');
      });

      let icon = $(this).children('.sort');
      if (!icon.hasClass('sort-active')) icon.addClass('sort-active');

      let oldDirection = this.dataset.sort;
      let direction = oldDirection === 'desc' || !oldDirection ? 'asc' : 'desc';
      this.dataset.sort = direction;

      icon.addClass(`sort-${direction}`);
      icon.removeClass(`sort-${oldDirection}`);

      const options = {
        sort: {
          direction: direction,
          field: this.dataset.field,
        }
      };

      // let filterStr = filterView.getFilterStr();
      if (filterView.filterStr) options.search = filterView.filterStr;

      eventEmitter.emit(SORT, options);
      console.log(this);
    });
  }

  render(arrData) {
    this.$tbody.html(this.createHTML(arrData));
  }

  createHTML(arrData) {
    return arrData.reduce((htmlFragment, obj) => htmlFragment + tableRow(obj), '');
  }




}
