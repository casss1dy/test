import eventEmitter, {OPEN, CLOSE} from "../ee";
import {getProductById} from "../models/model";
import {modalView, renderModalDelete} from "../view";
import {toggleSpinner} from '../views/spinner'; // TODO убрать 

export default class ModalController {
  constructor() {

    const actions = {
      view: async function (productId) {
        toggleSpinner();
        let response;
        try {
          response = await getProductById(productId);
        } catch (e) {}
    
        modalView.renderModalView(response.Data);
        toggleSpinner(false);
        modalView.toggle('view');
      },
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

    eventEmitter.on(OPEN, ({productId, modalId}) => {
      actions[modalId](productId);
    });

    eventEmitter.on(CLOSE, ({modal}) => {
      modalView.toggle(modal, true);
    });
  }

}