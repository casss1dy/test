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
};

view.toggleSpinner = function(isToggleBackdrop = true) {
  if (isToggleBackdrop) toggleBackdrop();

  if (spinner.detached) {
    spinner.detached.first().appendTo("body");
    spinner.detached = null;
  } else {
    spinner.detached = $(spinner.class).detach();
  }
};

view.toggleModal = function(modal) {
  // view.toggleBackdrop();
  $(modal).toggleClass('show');  // todo add data-dismiss
};


// todo rewrite to class ?
view.Alert = function(alert) {
  this.fragment = createHTMLFragment(Array(alert), 'alert');
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
    backdrop.detached = null;
  } else {
    backdrop.detached = $(backdrop.class).detach();
  }
}

view.render = function(productList, template, place) {

  let fragment = createHTMLFragment(productList, template);
  let placeToAppend = $dom[place];

  $dom[place].find('tbody').append(fragment);
};

view.getProductId = function(target) {
  return $(target).parents('.product').attr('id');
};

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

