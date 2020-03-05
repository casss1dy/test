import eventEmitter, {OPEN, CLOSE, SPINNER} from "../ee";
import {getProductById} from "../models/model";
import $ from "jquery";

export default class ModalController {
  constructor(view) {
    let modalId = view.$modal.attr("id");
    let modalController;

    if (modalId === 'view') {
      modalController = new ModalView(view);
    }

    if (modalId === 'delete') {
      modalController = new ModalDelete(view);
    }

    return modalController;
  }
}

class ModalView {
  constructor(view) {
    let self = this;
    self.view = view;

    eventEmitter.on(OPEN, async ({modalId, productId}) => {
      if (modalId === 'view') {
        await self.show(productId);
      }
    });

    eventEmitter.on(CLOSE, ({modal}) => {
      if (modal === 'view') {
        self.view.toggle(true);
      }
    });
  }

  async show(productId) {

    let self = this;

    eventEmitter.emit(SPINNER);

    let response;
    try {
      response = await getProductById(productId);
    } catch (e) {}

    self.view.render(response.Data);
    self.view.toggle();

    eventEmitter.emit(SPINNER, false);
  }
}

class ModalChange {
  constructor(view) {
    let self = this;
    self.view = view;
  }

  show(productId) {
    self.view.toggle(true);
  }
}

class ModalDelete {
  constructor(view) {
    let self = this;
    self.view = view;

    eventEmitter.on(OPEN, async ({modalId, productId}) => {
      if (modalId === 'delete') {
        await self.show(productId);
      }
    });

    eventEmitter.on(CLOSE, ({modal}) => {
      if (modal === 'delete') {
        self.view.toggle(true);
      }
    });
  }

  show(productId) {
    let self = this;
    self.view.setId(productId);
    self.view.toggle(true);
  }
}
