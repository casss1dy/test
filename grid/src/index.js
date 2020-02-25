import './sass/style.scss';
import $ from 'jquery';

import {getPromise} from './js/model.js';
import {toggleSpinner, toggleModal, renderTable, renderProductView, Alert} from './js/view.js';

async function loadPage() {
  let response;

  toggleSpinner();
  try {
    response = await getPromise();
  } catch (e) {
    new Alert({
      type: 'danger',
      error: e.status ? `${e.status} ${e.statusText}` : 'Something went wrong',
    }).show();
    return;
  } finally {
    toggleSpinner();
  }

  console.info(response.Data);
  renderTable(response.Data);

  // I guess spinner should get shown before requesting products list and get hidden after products are rendered.
  // Toggle means switch show/hide state every time it's called.
  // I don't see any code that shows spinner before request, so the spinner should be visible. Doesn't it?
  /**
   * при загрузке страницы сам спиннер есть в html (не инициируется js, это лишнее изменение dom?)
   промис settled => спиннер скрывается (toggle) => рендерится таблица со списком продуктов / сообщение об ошибке

   т.е.
   с одной стороны toggleSpinner - универсальный метод, который удобно использовать,
   с другой стороны - неочевидность при написании и отладке =>
   Q - разделить ли на showSpinner/hideSpinner?
   */

}

const actions = {
  view: async function (productId) {
    toggleSpinner();
    let response;
    try {
      response = await getPromise(productId);
    } catch (e) {}

    renderProductView(response.Data);
    toggleSpinner(false);
    toggleModal($('#view'));
  },

  edit: function () {
    toggleModal($('#edit'), true);
  },
  delete: function () {
    toggleModal($('#delete'), true);
  },
};


// TODO EE => View
$(loadPage);

// $('#tableProducts').on('click', '.product', (event) => {
//   // you can use event delegation here.
//   // look you have .product class on each tr, right?
//   // you could subscribe like this
//   // $('#tableProducts').on('click', '.product', function (event) {
//   // const productId = event.currentTarget.id;
//   // // the code above and below do the same
//   // const productId = this.id;
//   // it's easy, right? you don't need to use ugly functions like parents or closes, which are slow and expensive
//   let modalId = $(event.target).data('modal');
//
//   if (modalId !== undefined) {
//     let productId = view.getProductId($(event.target));
//     actions[modalId](productId);
//   }
// });

import { eventEmitter } from './js/ee';

eventEmitter.on('modalOpen', ({productId, modalId}) => {
  actions[modalId](productId);
});

eventEmitter.on('modalClose', ({$modal}) => {
  toggleModal($modal, true);
});

eventEmitter.on('deleteProduct', async ({productId}) => {
  let response;
  try {
    response = await getPromise(productId, 'delete');
  } catch (e) {}

});








