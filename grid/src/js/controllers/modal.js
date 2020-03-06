import {getProductById} from "../models/model";
import eventEmitter, {OPEN, CLOSE, SPINNER} from "../ee";

export default class ModalController {
  constructor(view) {
    let modalId = view.$modal.attr("id");
    let modalController;

    if (modalId === 'view') {
      modalController = new ModalView(view);
    }

    if (modalId === 'change') {
      modalController = new ModalChange(view);
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

    eventEmitter.on(OPEN, ({modalId, ...product}) => {
      console.log(modalId);
      if (modalId === 'change') {
        self.show(product);
      }
    });

    eventEmitter.on(CLOSE, ({modal}) => {
      console.log(modal);
      if (modal === 'change') {
        self.view.toggle(true);
      }
    });
  }

  async show({productId, productName}) {
    let self = this;
    // console.log(product);

    if (productId) {
      let self = this;

      eventEmitter.emit(SPINNER);

      let response;
      try {
        response = await getProductById(productId);
      } catch (e) {}

      self.view.render(response.Data);
      self.view.toggle();

      eventEmitter.emit(SPINNER, false);
    } else {
      self.view.render({});
      self.view.toggle(true);
    }
  }
}

class ModalDelete {
  constructor(view) {
    let self = this;
    self.view = view;

    eventEmitter.on(OPEN, ({modalId, ...product}) => {
      if (modalId === 'delete') {
        self.show(product);
      }
    });

    eventEmitter.on(CLOSE, ({modal}) => {
      console.log(modal);
      if (modal === 'delete') {
        self.view.toggle(true);
      }
    });
  }

  show(product) {
    let self = this;

    self.view.render({id: product.productId, name: product.productName});
    self.view.toggle(true);
  }
}
