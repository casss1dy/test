import {getProductById} from "../models/model";
import eventEmitter, {OPEN, CLOSE, SPINNER, RENDER_FORM, ALERT} from "../ee";

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

    modalController.type = modalId;

    eventEmitter.on(OPEN, ({modalId, ...product}) => {
      if (modalId === modalController.type) {
        modalController.show(product);
      }
    });

    eventEmitter.on(CLOSE, ({modal}) => {
      // debugger;
      if (modal === modalController.type && modalController.view.isOpen()) {
        modalController.view.toggle(true);
      }
    });

    return modalController;
  }
}

class ModalView {
  constructor(view) {
    let self = this;
    self.view = view;
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

  async show({productId, productName}) {
    let self = this;
    // console.log(product);

    if (productId) {
      let self = this;

      eventEmitter.emit(SPINNER);

      let response;
      try {
        response = await getProductById(productId);
      } catch (e) {
        let error = e.status ? `${e.status} ${e.statusText}` : 'Something went wrong';
        eventEmitter.emit(ALERT, error);
        return;
      } finally {
        eventEmitter.emit(SPINNER, false);
      }

      eventEmitter.emit(RENDER_FORM, {
        $modal: self.view.$modal,
        data: response.Data,
      });

      self.view.toggle();

    } else {
      eventEmitter.emit(RENDER_FORM, {
        $modal: self.view.$modal,
        data: {},
      });

      self.view.toggle(true);
    }
  }
}

class ModalDelete {
  constructor(view) {
    let self = this;
    self.view = view;
  }

  show(product) {
    console.log(this);

    let self = this;

    self.view.render({id: product.productId, name: product.productName});
    self.view.toggle(true);
  }
}
