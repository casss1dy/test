import './sass/style.scss';
import $ from 'jquery';

import {getProductById, getProductList, deleteProduct, addProduct} from './js/model.js';

// TODO компоненты
import {toggleSpinner, toggleModal, renderTable, renderModalView,
  renderModalDelete, toggleBtnDisable, isModalOpen, Alert, toggleValidationError, changeSorting} from './js/view.js';

$(getList()); // TODO move to vie, параметры
// $(async () => {
//   await getList();
// }); // TODO move to view

async function getList(search = '', sort = '') { // todo передавать объект
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

  let data = response.Data;

  if (!$.isEmptyObject(search)) {
    data = response.Data.filter((item) => {
      let name = item.name.toLowerCase();
      return name.includes(search.search.toLowerCase());
    })
  } 

  if (!$.isEmptyObject(sort)) {
    data = data.sort((a, b) => {
      if (sort.direction === 'asc') {
        if (a[sort.field] < b[sort.field]) return -1;
        if (a[sort.field] > b[sort.field]) return 1;
      } else {
        if (a[sort.field] < b[sort.field]) return 1;
        if (a[sort.field] > b[sort.field]) return -1;
      }

      return 0;
    });

  }

  renderTable(data);
  console.log(data);
  
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

import {OPEN, CLOSE, DELETE, ADD, VALIDATE, SEARCH, SORT} from './js/ee';
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

const validate = {
  name(value) {
    let error = [];

    if (!value) error.push('Should be not empty');
    if (value.length > 15) error.push('Max length 15 characters');
    if (!value.trim()) error.push('Should consist not only spaces');

    if (error.length) {
      throw new Error(error.join('<br>'));
    }
  },

  email(value) {
    let pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,6}$/i;
    // debugger;
    if (value.search(pattern) == -1) 
      throw new Error('Should be in email formate');
  },

  count(value) {
    // todo . + - 
    if (!+value) throw new Error('Should be non zero');
  },

  price(value) {
    
  }
};


eventEmitter.on(VALIDATE, (input) => {
  
  try {
    validate[input.name](input.value);
  } catch(e) {
    toggleValidationError(input.name, e.message);
    return;
  }

  toggleValidationError(input.name);
  
});

eventEmitter.on(SEARCH, async (search) => {
  // todo обработать строку search
  // todo кнопка сброса
  console.log(search);
  await getList(search);
});

eventEmitter.on(SORT, async (sort) => {
  await getList('', sort);
  console.log(sort);
});

eventEmitter.on(ADD, async ({data}) => {
  toggleBtnDisable('saveBtn');
  const dataProcessed = dataProcessing(data);
  console.log(dataProcessed);

  // return;

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








