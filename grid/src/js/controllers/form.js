import {deleteProduct, addProduct} from '../models/model.js';
import eventEmitter, {ADD, VALIDATE, DELETE, RENDER, CLOSE, ALERT} from "../ee";

import $ from "jquery"; // TODO убрать

export default class FormController {
  constructor(view) {
    let self = this;
    self.view = view;
    
    eventEmitter.on(ADD, async (data) => await self.addProduct(data));
    eventEmitter.on(VALIDATE, (input) => self.validate(input));
    eventEmitter.on(DELETE, async ({productId}) => await self.deleteProduct({productId}));
  }

  async addProduct(data) {
    let self = this;

    if (!self.view.$saveBtn) self.view.init();

    let isValidated = self.validate(data);
    if (!isValidated) {
      eventEmitter.emit(ALERT, 'Check the correctness');
      return;
    }

    self.view.toggleBtnDisable(self.view.$saveBtn);
    const dataProcessed = dataProcessing(data);
    console.log(dataProcessed);
  
    return;
  
    try {
      await addProduct(JSON.stringify(dataProcessed));
    } catch (e) {
      let error = e.status ? `${e.status} ${e.statusText}` : 'Something went wrong';
      eventEmitter.emit(ALERT, error);
      return;
    } finally {
      self.view.toggleBtnDisable(self.view.$saveBtn);
    }

    eventEmitter.emit(CLOSE, {modal: 'change'});
    eventEmitter.emit(RENDER, {});
  }

  async deleteProduct ({productId}) {
    // debugger;
    let self = this;

    if (!self.view.$deleteBtn) self.view.init();

    self.view.toggleBtnDisable(self.view.$deleteBtn);
    
    // return;
  
    try {
      await deleteProduct(productId);
    } catch (e) {
      let error = e.status ? `${e.status} ${e.statusText}` : 'Something went wrong';
      eventEmitter.emit(ALERT, error);
      return;
    } finally {
      eventEmitter.emit(CLOSE, {modal: 'delete'});
    }
  
    self.view.toggleBtnDisable(self.view.$deleteBtn);

    eventEmitter.emit(RENDER, {});
  }

  validate(arInput) {

    let self = this;
    let isValidated = true;
    if (!self.view.$formChange) self.view.init();

    const rules = {
      name(value) {
        let error = [];
    
        if (!value) error.push('Should be not empty');
        if (value.length > 15) error.push('Max length 15 characters');
        if (!value.trim()) error.push('Should consist not only spaces');
    
        return error.join('<br>');
      },
    
      email(value) {
        let error = [];
        let pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,6}$/i;
        // debugger;
        if (value.search(pattern) == -1) error.push('Should be in email format');
    
        return error.join('<br>');
      },
    
      count(value) {
        let error = [];
        // TODO . + -, макс колв-о символов в константу
        if (parseFloat(value) === 0) error.push('Should be non zero');
        if (!+value) error.push('Should be not empty');
        if (value.length > 10) error.push('Max count is 9,999,999,999');

        return error.join('<br>');
      },
    
      price(value) {
        let error = [];

        if (value.length > 10) error.push('Max price is 9,999,999,999');

        return error.join('<br>');
      }
    };

    arInput.forEach((input) => {
      if (~Object.keys(rules).indexOf(input.name)) {
        self.view.toggleValidationError(input.name);
        
        const errors = rules[input.name](input.value);
        
        if (errors) {
          self.view.toggleValidationError(input.name, errors);
          isValidated = false;
        }
      }
    });

    console.log('???', isValidated);

    return isValidated;
  }
}  

function dataProcessing(data) {
  let dataProcessed = {};
  const isNumber = ['price', 'count'];

  data.forEach((item) => {
    dataProcessed[item.name] = ~$.inArray(item.name, isNumber) ? +item.value : item.value;
  });

  return dataProcessed;
  // console.log(this.name + '=' + this.value);
}

