import $ from "jquery";
import {tableRow} from "./template";
import eventEmitter, {LOAD, SORT, OPEN} from "../ee";
import {filterView} from "../view";

export default class TableView {
  constructor() {
    let self = this;
    const $table = $('#tableProducts');
    self.$thead = $table.find('thead');
    self.$tbody = $table.find('tbody');

    self.$tbody.on('click', '.product', self.triggerModalOpen);
  }

  init() {
    let self = this;

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

  render(rows) {
    this.$tbody.html(
      rows.map(r => this.template(r)).join('')
    );
  }

  template({id, count, name, price}) {
    const template = `<tr id="${id}" class="product">
            <td>
              <span class="product-name" data-modal="view">${name}</span>
              <span class="badge badge-warning product-count">${count}</span>
            </td>
            <td>${price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td>
              <button type="button" class="btn btn-outline-success" data-modal="edit">Edit</button>
              <button type="button" class="btn btn-outline-danger btn-delete" data-modal="delete">Delete</button>
            </td>
        </tr>`;
    return template;
  }

  triggerModalOpen (e) {
    let modalId = $(e.target).data('modal');
    if (modalId === undefined) return;

    console.log('modal', modalId);
    console.log(this.id);

    eventEmitter.emit(OPEN, {
      modalId: modalId,
      productId: this.id || null,
    });
  }

}
