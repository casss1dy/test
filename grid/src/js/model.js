import { ajax } from "jquery";

function getEndpointURL(action = 'get', productId = null) {
  let url = 'https://api-crud-mongo.herokuapp.com/api/v1/products';

  url += (action === 'get') ? '' : '/' + action;
  if (productId) url += '/' + productId;

  return url;
}

export function getPromise (productId = null, action = 'get') {
  // TODO see about function name
  return ajax({
    dataType: 'json',
    url: getEndpointURL(action, productId),
  });
}

