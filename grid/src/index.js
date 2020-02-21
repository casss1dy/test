import './sass/style.scss';
import $ from 'jquery';

import {model} from './js/model.js';
import {view} from './js/view.js';

async function loadPage() {
  try {
    const response = await model.getProductList();
    view.render(response.Data, 'tableRow', 'table');
  } catch(e) {
    new view.Alert({
      type: 'danger',
      title: `${e.status}`,
      text: `${e.statusText}`
    }).show();
  }

  view.toggleSpinner();
}

const actions = {
  view: async function(productId) {
    try {
      view.toggleSpinner();

      const response = await model.getProductList(productId);
      view.render(Array(response.Data), 'productView', 'modalView');

    } catch (e) {}

    view.toggleSpinner(false);
  },

  edit: function() {},
  delete: function() {},
};


// View
$(loadPage);

$('#tableProducts').on('click', function (event) {

  let target = $(event.target);
  let modalType = target.data('modal');

  // let isCloseModalBtn = target.hasClass('btn-close'); // ------
  // let modalType = isCloseModalBtn ? target.parents('.modal').data('action') : target.data('modal');


  if (modalType) {

    view.toggleModal($(`.${modalType}`));

    let productId = view.getProductId(target);
    actions[modalType](productId);
  }

});

$('.btn-close').on('click', function(event) {
  let target = $(event.currentTarget);

  let parentClass = target.data('dismiss');

  let parent = $(target).closest(`.${parentClass}`);
  console.log(parent);

  view.toggleModal(modalType);
});



// todo export функций, а не объектов
// todo emmite
