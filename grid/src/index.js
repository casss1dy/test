import './sass/style.scss';
import $ from 'jquery';

import {getProductById, getProductList, deleteProduct} from './js/model.js';

import {toggleSpinner, toggleModal, renderTable, renderModalView,
  renderModalDelete, Alert} from './js/view.js';

async function loadPage() {
  let response;

  toggleSpinner();

  try {
    response = await getProductList();
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
  // todo render(data, callback)
}

const actions = {
  view: async function (productId) {
    toggleSpinner();
    let response;
    try {
      response = await getProductById(productId);
    } catch (e) {}

    renderModalView(response.Data);
    toggleSpinner(false);
    toggleModal('view');
  },
  add: function (productId) {
    toggleModal('edit', true);
  },
  edit: function (productId) {
    toggleModal('edit', true);
  },
  delete: function (productId) {
    renderModalDelete(productId);
    toggleModal('delete', true);
  },
};


// TODO EE => View
$(loadPage);

import { eventEmitter } from './js/ee';

eventEmitter.on('modalOpen', ({productId, modalId}) => {
  actions[modalId](productId);
});

eventEmitter.on('modalClose', ({modal}) => {
  toggleModal(modal, true);
});

eventEmitter.on('deleteProduct', async ({productId}) => {
  let response;
  try {
    response = await deleteProductById(productId);
  } catch (e) {}

  toggleModal('delete', true);
});








