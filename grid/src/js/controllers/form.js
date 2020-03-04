import eventEmitter, {ADD, VALIDATE, DELETE} from "../ee";
import {toggleBtnDisable, toggleValidationError} from '../views/form';


import {deleteProduct, addProduct} from '../models/model.js';
import {getList, modalView} from '../../index'; // TODO избавиться от этих зависимостей
import $ from "jquery"; // TODO заменить $ и убрать

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
    // TODO . + -, макс колв-о символов в константу
    if (parseFloat(value) === 0) throw new Error('Should be non zero');
    if (!+value) throw new Error('Should be not empty');
    if (value.length > 10) throw new Error('Max count is 9,999,999,999');
  },

  price(value) {
    if (value.length > 10) throw new Error('Max price is 9,999,999,999');
  }
};


eventEmitter.on(ADD, async ({data}) => {
  toggleBtnDisable('save');
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
    toggleBtnDisable('save');
  }

  if (modalView.isOpen('edit')) {
    modalView.toggle('edit', true);
  }

  await getList();
});
  

eventEmitter.on(VALIDATE, (input) => {
  try {
    validate[input.name](input.value);
  } catch(e) {
    toggleValidationError(input.name, e.message);
    return;
  }

  toggleValidationError(input.name);

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

eventEmitter.on(DELETE, async ({productId}) => {
  toggleBtnDisable('delete'); // TODO именование

  try {
    await deleteProduct(productId);
  } catch (e) {
    new Alert({
      type: 'danger',
      error: e.status ? `${e.status} ${e.statusText}` : 'Something went wrong',
    }).show();
    return;
  } finally {
    if (modalView.isOpen('delete')) {
      modalView.toggle('delete', true);
    }
  }

  toggleBtnDisable('delete');
  await getList();
});