import './sass/style.scss';
import $ from 'jquery';

import {getProductById, getProductList, deleteProduct, addProduct} from './js/models/model.js';

// TODO компоненты
import {renderTable, Alert, changeSorting} from './js/view';
import {toggleBtnDisable, toggleValidationError} from './js/views/form';
import {toggleSpinner} from './js/views/spinner';
import './js/controllers/form';

$(getList()); // TODO move to vie, параметры
// $(async () => {
//   await getList();
// }); 

export async function getList(search = '', sort = '') { // todo передавать объект
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
      return name.includes(search.toLowerCase());
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


import {DELETE, ADD, VALIDATE, SORT} from './js/ee';
import eventEmitter from "./js/ee";

// Q
import FilterController from './js/controllers/filter';
const filterController = new FilterController();

import ModalView from './js/views/modal';
export const modalView = new ModalView();

import ModalController from './js/controllers/modal';
const modalController = new ModalController();

eventEmitter.on(SORT, async ({search = '', sort}) => {
  // todo session storage с настройкой sort (name, price)
  await getList(search, sort);
  console.log(sort);
});








