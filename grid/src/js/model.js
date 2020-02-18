export const model = {};

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
  const endpointURL = getEndpointURL('get', productId);
  const response = {};

  try {
    await $.ajax({
      dataType: 'json',
      url: endpointURL,
      success: function (data) {
        response.data = data.Data;
      },
      complete: function(jqXHR) {
        response.statusCode = jqXHR.status;
        response.statusText = jqXHR.statusText;
      },
    });
  } catch(e) {
    console.log(e);
    return response;
  }

  return response;
};

