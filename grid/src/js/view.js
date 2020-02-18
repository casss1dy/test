import $ from "jquery";

export const view = {};

const dom = {
  table: $('#tableProducts'),
  loader: $('#pageLoader'),
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
};

view.removeSpinner = function() {
  dom.loader.remove();
  $('body').removeClass('page-loading'); // заменить на стили бутстрап
};

view.render = function(productList, template, place) {

  let fragment = createHTMLFragment(productList, template);
  let placeToAppend = dom[place];

  // switch (place) {
  //   case 'table':
  //     placeToAppend = placeToAppend.children('tbody');
  //     break;
  //   case 'modalView':
  //     placeToAppend = placeToAppend.children('tbody');
  //     break;
  // }

  dom[place].find('tbody').append(fragment);
};

view.toggleModal = function(type) {
  $('body').toggleClass('backdrop');
  $(`#${type}-product`).fadeToggle();
};

view.getProductId = function(target) {
  return $(target).parents('.product').attr('id');
};

view.setTableListener = function() {
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

