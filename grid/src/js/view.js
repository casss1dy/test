import $ from "jquery";

export const view = {};

const $dom = {
  table: $('#tableProducts'),
  spinner: $('#pageLoader'),
  product: {
    item: $('.product'),
    name: $('.product-name'),
  },
  modalView: $('#view-product'),
};

const template = {
  tableRow:
    `<tr id="#ID#" class="product">
          <td><span class="badge badge-warning">#COUNT#</span></td>
          <td><span class="product-name" data-modal="view">#NAME#</span></td>
          <td>$ #PRICE#</td>
          <td>
            <button type="button" class="btn btn-outline-success" data-modal="edit">Edit</button>
            <button type="button" class="btn btn-outline-danger btn-delete" data-modal="delete">Delete</button>
          </td>
      </tr>`,
  productView:
    `<tr>
        <th>Name</th>
        <td>#NAME#</td>
    </tr>
    <tr>
        <th>Supplier email</th>
        <td>#EMAIL#</td>
    </tr>`,
  alert:
    `<div class="alert alert-#TYPE# alert-main alert-dismissible fade show" role="alert">
        <strong>#TITLE# #TEXT# </strong><br>
        Pls try again later
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>`,
};


const spinner = {
  detached: null,
  class: '#pageLoader',
  // it's should be selector but not class
};

view.toggleSpinner = function(isToggleBackdrop = true) {
  if (isToggleBackdrop) toggleBackdrop();

  if (spinner.detached) {
    spinner.detached.first().appendTo("body");
    spinner.detached = null;
  } else {
    spinner.detached = $(spinner.class).detach();
    // it was really good idea to avoid finding it in the DOM every time and use $dom.spinner. Why don't you use it?
    // if I'm not mistaken you don't need to create a new variable to store detached node. I mean you could just do $dom.spinner.detach(); 
    //and append the same variable again if you need to
  }
};

view.toggleModal = function(modal) {
  // view.toggleBackdrop();
  $(modal).toggleClass('show');  // todo add data-dismiss
};


// todo rewrite to class ?
view.Alert = function(alert) {
  this.fragment = createHTMLFragment(Array(alert), 'alert');
  // I don't think it's good idea to use Array constructor. Literals are preferred way to create arrays almost in any case
  console.log(this.fragment);
};

view.Alert.prototype.show = function () {
  $(this.fragment).appendTo('body');
};


const backdrop = {
  detached: null,
  class: '.modal-backdrop',
};

function toggleBackdrop() {
  $('body').toggleClass('modal-open');

  if (backdrop.detached) {
    backdrop.detached.first().appendTo("body");
    // what does first does in that case?
    backdrop.detached = null;
  } else {
    backdrop.detached = $(backdrop.class).detach();
  }
}

view.render = function(productList, template, place) {

  let fragment = createHTMLFragment(productList, template);
  let placeToAppend = $dom[place];

  $dom[place].find('tbody').append(fragment);
  // it's unsafe. there could be some other tbodies. you append your fragment in every tbody
};

view.getProductId = function(target) {
  return $(target).parents('.product').attr('id');
};

// what you're doing below is implementing your own template engine.
// let's avoid reinventing the wheel. there are a lot of existing ones.
// javascript already has build in template engine and we talked about that.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
// here is the example:
// const template = {
//   tableRow: ({ id, count, name, price }) =>
//     `<tr id="${id}" class="product">
//           <td><span class="badge badge-warning">${count}</span></td>
//           <td><span class="product-name" data-modal="view">${name}</span></td>
//           <td>$ ${price}</td>
//           <td>
//             <button type="button" class="btn btn-outline-success" data-modal="edit">Edit</button>
//             <button type="button" class="btn btn-outline-danger btn-delete" data-modal="delete">Delete</button>
//           </td>
//       </tr>`
// }

function createHTMLFragment(objList, templateName) {
  console.log('data', objList);
  console.log('data', templateName);

  let htmlFragment = '';

  objList.forEach((obj) => {
    htmlFragment += template[templateName];
    Object.keys(obj).forEach((prop) => {
      htmlFragment = htmlFragment.replace(`#${prop.toUpperCase()}#`, obj[prop]);
    });
  });

  return htmlFragment;
}


// The last but not least note:
// DOM manipulations, traverse and other DOM interactions are EXPENSIVE
// use should use it as little as possible
