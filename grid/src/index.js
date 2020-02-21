import './sass/style.scss';
import $ from 'jquery';

import {model} from './js/model.js';
import {view} from './js/view.js';

async function loadPage() {
  try {
    const response = await model.getProductList();
    view.render(response.Data, 'tableRow', 'table');
  } catch(e) {
    // the catch above actully catches all exceptions, including those ones that happened inside view.render, 
    // I doubt some view excetion has status or statusText
    new view.Alert({
      type: 'danger',
      title: `${e.status}`,
      text: `${e.statusText}`
    }).show();
  }

  view.toggleSpinner();
  // I guess spinner should get shown before requesting products list and get hidden after products are rendered.
  // Toggle means switch show/hide state every time it's called. 
  // I don't see any code that shows spinner before request, so the spinner should be visible. Doesn't it?
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
  // you can use event delegation here.
  // look you have .product class on each tr, right?
  // you could subscribe like this
  // $('#tableProducts').on('click', '.product', function (event) {
  // const productId = event.currentTarget.id;
  // // the code above and below do the same
  // const productId = this.id;
  // it's easy, right? you don't need to use ugly functions like parents or closes, which are slow and expensive

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
// it's emit