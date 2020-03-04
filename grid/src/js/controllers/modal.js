import eventEmitter, {OPEN, CLOSE, SPINNER} from "../ee";
import {getProductById} from "../models/model";
import {modalView, renderModalDelete} from "../view";

export default class ModalController {
  constructor(view) {
    console.log('sdsds', view.$id);
    if (view.$id.id === 'view') return new ModalView();

    const actions = {



      add: function () {
        modalView.toggle('edit', true);
      },
      edit: function (productId) {
        modalView.toggle('edit', true);
      },
      delete: function (productId) {
        renderModalDelete(productId);
        modalView.toggle('delete', true);
      },
    };


  }
}

class ModalView {
  constructor() {
    let self = this;
    self.view = view;

    eventEmitter.on(OPEN, ({productId}) => self.show(productId));
    eventEmitter.on(CLOSE, () => self.view.toggle(true));

    console.log(self);
  }  

  async show(productId) {
    console.log('ннннн');

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