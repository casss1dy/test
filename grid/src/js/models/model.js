import { ajax } from "jquery";

export function getProductList() {
  let endpointURL = getEndpointURL();
  return getResponse(endpointURL);
}

export function getProductById(productId) {
  let endpointURL = getEndpointURL('get', productId);
  return getResponse(endpointURL);
}

export function deleteProduct(productId) {
  let endpointURL = getEndpointURL('delete', productId);
  return getResponse(endpointURL, 'DELETE');
}

export function addProduct(data) {
  let endpointURL = getEndpointURL('add');
  return getResponse(endpointURL, 'POST', data);
}

export function updateProduct(productId, data) {
  console.log(11111111, data);
  let endpointURL = getEndpointURL('update', productId);
  return getResponse(endpointURL, 'PUT', data);
}

// TODO ? вынести в отд файл

function getResponse (endpointURL, type = 'GET', data = null) {

  const settings = {
    dataType: 'json',
    url: endpointURL,
    type: type,
  };


  if (type === 'POST' || type === 'PUT') {
    settings.data = data;
    settings.contentType = 'application/json';
    settings.processData = false;
  }

  console.log(settings);

  return ajax(settings);
}

function getEndpointURL(action = 'get', productId = null) {
  let url = 'https://api-crud-mongo.herokuapp.com/api/v1/products';

  url += (action === 'get') ? '' : '/' + action;
  if (productId) url += '/' + productId;

  return url;
}



