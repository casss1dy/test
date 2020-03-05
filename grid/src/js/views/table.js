import $ from "jquery";
import eventEmitter, {SORT, OPEN, RENDER} from "../ee";

export default class TableView {
  constructor() {
    let self = this;
    const $table = $('#tableProducts');
    self.$thead = $table.find('thead');
    self.$tbody = $table.find('tbody');
    self.$btnAdd = $('#showAddModal');

    self.$tbody.on('click', '.product', self.triggerModalOpen);
    self.$btnAdd.on('click', self.triggerModalOpen);
    self.$thead.on('click', '.sortable', self.triggerSort);
  }

  render(rows) {
    this.$tbody.html(
      rows.map(r => this.template(r)).join('')
    );
  }

  sort(direction, oldDirection, $icon) {
    let self = this;

    self.$thead.find('.sort').each(function () {
      $(this).removeClass('sort-active');
    });

    if (!$icon.hasClass('sort-active')) $icon.addClass('sort-active');
    
    $icon.closest('.sortable').attr('data-sort', direction);

    $icon.addClass(`sort-${direction}`);
    $icon.removeClass(`sort-${oldDirection}`);

  }

  template({id, count, name, price}) {
    const template = `<tr id="${id}" class="product">
            <td>
              <span class="product-name" data-modal="view">${name}</span>
              <span class="badge badge-warning product-count">${count}</span>
            </td>
            <td>${price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td>
              <button type="button" class="btn btn-outline-success" data-modal="change">Edit</button>
              <button type="button" class="btn btn-outline-danger btn-delete" data-modal="delete">Delete</button>
            </td>
        </tr>`;
    return template;
  }

  triggerModalOpen (e) {
    let modalId = $(e.target).data('modal');
    if (modalId === undefined) return;

    let id = this.classList.contains('product') ? this.id : null;
    let name = id ? $(this).find('.product-name').text() : null;

    console.log(e.target);
    console.log('modal', modalId);
    console.log(this.id);

    eventEmitter.emit(OPEN, {
      modalId: modalId,
      productId: id,
      productName: name,
    });
  }

  triggerSort() {
    console.log(this);
    eventEmitter.emit(RENDER, {
      sort:  {
        field: this.dataset.field,
        oldDirection: this.dataset.sort,
        $icon: $(this).children('.sort'),
      }
    });
  }

}
