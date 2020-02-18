import './sass/style.scss';

import $ from 'jquery';
global.jQuery = $;
global.$ = $;

const model = require('./js/model').model;
const view = require('./js/view').view;

async function loadPage() {
  const productsData = await model.getProductList();
  if (productsData.statusCode === 200) {
    view.render(productsData.data, 'tableRow', 'table');
    view.removeSpinner();
  }
}

const actions = {
  view: async function(productId) {
    console.log(1, productId);
    const productsData = await model.getProductList(productId);
    view.render(Array(productsData.data), 'productView', 'modalView');
    console.log(2, productsData);
  },

  edit: function() {},
  delete: function() {},
};


// View
$(loadPage);

$('#tableProducts, .modal .btn-close').on('click', function (event) {

  let target = $(event.target);
  let isCloseModalBtn = target.hasClass('btn-close');
  let modalType = isCloseModalBtn ? target.parents('.modal').data('action') : target.data('modal');

  if (modalType) {
    view.toggleModal(modalType);

    if (!isCloseModalBtn) {
      let productId = view.getProductId(target);
      actions[modalType](productId);
    }
  }
});



// fetch(`https://api-crud-mongo.herokuapp.com/api/v1/products`)
//   .then(response => {console.log(response.json())})
//   .catch();
