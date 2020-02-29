import './sass/style.scss';
import $ from 'jquery';

import {getProductById, getProductList, deleteProduct, addProduct} from './js/model.js';

// TODO компоненты
import {toggleSpinner, toggleModal, renderTable, renderModalView,
  renderModalDelete, toggleBtnDisable, isModalOpen, Alert} from './js/view.js';

async function getList() {
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

  // console.info(response.Data);
  renderTable(response.Data);  // todo render(data, callback)
}

// open + render dialogs
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


$(getList); // TODO move to view

import {OPEN, CLOSE, DELETE, ADD} from './js/ee';
import eventEmitter from "./js/ee";

eventEmitter.on(OPEN, ({productId, modalId}) => {
  actions[modalId](productId);
});

eventEmitter.on(CLOSE, ({modal}) => {
  toggleModal(modal, true);
});

eventEmitter.on(DELETE, async ({productId}) => {
  toggleBtnDisable('deleteBtn'); // TODO именование

  try {
    await deleteProduct(productId);
  } catch (e) {
    new Alert({
      type: 'danger',
      error: e.status ? `${e.status} ${e.statusText}` : 'Something went wrong',
    }).show();
    return;
  } finally {
    if (isModalOpen('delete')) {
      toggleModal('delete', true);
    }
  }

  toggleBtnDisable('deleteBtn');
  await getList();
});

eventEmitter.on(ADD, async ({data}) => {
  toggleBtnDisable('saveBtn');
  const dataProcessed = dataProcessing(data);
  console.log(dataProcessed);

  try {
    await addProduct(JSON.stringify(dataProcessed));
  } catch (e) {
    new Alert({
      type: 'danger',
      error: e.status ? `${e.status} ${e.statusText}` : 'Something went wrong',
    }).show();
    return;
  } finally {
    toggleBtnDisable('saveBtn');
  }

  if (isModalOpen('edit')) {
    toggleModal('edit', true);
  }

  await getList();
});


function dataProcessing(data) {
  let dataProcessed = {};
  const isNumber = ['price', 'count'];

  data.forEach((item) => {
    dataProcessed[item.name] = ~$.inArray(item.name, isNumber) ? +item.value : item.value;
  });

  return dataProcessed;
  // console.log(this.name + '=' + this.value);
}








