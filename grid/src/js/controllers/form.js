import {deleteProduct, addProduct, updateProduct} from '../models/model.js';
import eventEmitter, {ADD, VALIDATE, DELETE, RENDER, RENDER_FORM, CLOSE, ALERT} from "../ee";

import $ from "jquery"; // TODO убрать

export default class FormController {
  constructor(view) {
    let self = this;
    self.view = view;

    eventEmitter.on(ADD, async ({data, product}) => await self.addProduct({data, product}));
    eventEmitter.on(VALIDATE, (input) => self.validate(input));
    eventEmitter.on(DELETE, async ({productId}) => await self.deleteProduct({productId}));
    eventEmitter.on(RENDER_FORM, async (params) => self.render(params));
  }

  async addProduct({data, product}) {

    console.log(product);
    let self = this;

    // if (!self.view.$saveBtn) self.view.init();

    let isValidated = self.validate(data);
    if (!isValidated) {
      eventEmitter.emit(ALERT, 'Check the correctness');
      return;
    }

    self.view.toggleBtnDisable(self.view.$saveBtn, product);
    const dataProcessed = dataProcessing(data);
    console.log(dataProcessed);

    // return;

    try {
      if (product) {
        console.log('update');
        await updateProduct(product, JSON.stringify(dataProcessed));
      } else {
        console.log('add');
        await addProduct(JSON.stringify(dataProcessed));
      }
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

    self.view.toggleBtnDisable(self.view.$deleteBtn, productId);

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
    // if (!self.view.$formChange) self.view.init();

    const rules = {
      name(value) {
        let error = [];

        if (!value) error.push('Should be not empty');
        if (value.length > 30) error.push('Max length 30 characters');
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

        if (parseFloat(value) === 0) error.push('Should be non zero');
        if (value.length === 0) error.push('Should be not empty');
        if ((+value ^ 0) !== +value || +value < 0 || !parseInt(value)) error.push('Should be positive integer');
        if (value.length > 6) error.push('Max count is 999 999');

        return error.join('<br>');
      },

      price(value) {
        let error = [];

        if (value.length > 10) error.push('Max price is 9,999,999,999');
        if (!+value) error.push('Should be not empty');

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

  render({$modal, data}) {
    let self = this;

    self.view.render($modal, data);


  }
}

function dataProcessing(data) {
  let dataProcessed = {};

  data.forEach((item) => {
    dataProcessed[item.name] = +item.value == item.value ? +item.value : item.value;
    if (typeof dataProcessed[item.name] === 'string') {
      let str = dataProcessed[item.name];
      str = str.replace(/<br>/gi, "\n");
      str = str.replace(/<p.*>/gi, "\n");
      str = str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
      str = str.replace(/<(?:.|\s)*?>/g, "");
      dataProcessed[item.name] = str;
    }

  });

  return dataProcessed;
  // console.log(this.name + '=' + this.value);
}

