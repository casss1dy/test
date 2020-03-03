import eventEmitter, {OPEN, CLOSE} from "../ee";
import {modalView, renderModalDelete} from "../view";

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
      add: function (productId) {
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