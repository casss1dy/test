import $ from "jquery";

export const model = {};

// ? параметр action = add/update/delete => строка
function getEndpointURL(action = 'get', productId = null) {
  
  let url = 'https://api-crud-mongo.herokuapp.com/api/v1/products';

  switch (action) {
    case 'get':
      url = productId ? `${url}/${productId}` : `${url}`;
      break;
    case 'post':
      url = `${url}/add`;
      break;
    case 'update' :
      url = `${url}/update/${productId}`;
      break;
    case 'delete':
      url = `${url}/delete/${productId}`;
      break;
  }

  return url;
}

model.getProductList = async function(productId = null) {
  // getProductList returns product list OR product by id
  // your method should always do exactly what their name claims they do. It's the law! It's critically important
  return $.ajax({
    dataType: 'json',
    url: getEndpointURL('get', productId),
  });
};

