export function tableRow({id, count, name, price}) {
  const template = `<tr id="${id}" class="product">
          <td>
            <span class="product-name" data-modal="view">${name}</span>
            <span class="badge badge-warning product-count">${count}</span>
          </td>
          <td>${price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
          <td>
            <button type="button" class="btn btn-outline-success" data-modal="edit">Edit</button>
            <button type="button" class="btn btn-outline-danger btn-delete" data-modal="delete">Delete</button>
          </td>
      </tr>`;
  return template;
}

export function table(rows) {
  return rows.map(r => tableRow(r)).join('');
}

export function productView({email, count, price, delivery}) {
  let deliveryInfo;
  if (delivery.country === null && delivery.city === null) 
    deliveryInfo = 'No';
  else if (Array.isArray(delivery.city)) 
    deliveryInfo = `${delivery.country} / ${delivery.city.join(', ')}`;
    
  const template = `<tr>
        <th width="150">Count</th>
        <td>${count}</td>
    </tr>
    <tr>
        <th>Supplier email</th>
        <td><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
        <th>Price</th>
        <td>${price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
    </tr>
    <tr>
        <th>Delivery</th>
        <td>${deliveryInfo}</td>
    </tr>`;

  return template;
}

export function alert({type, error}) {
  const template = `<div class="alert alert-${type} alert-main alert-dismissible fade show" role="alert">
        <strong> ${error} </strong><br>
        Pls try again later
        <button type="button" class="close btn-close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>`;

  return template;
}

export function editProduct({type, error}) {
  const template = `<div class="alert alert-${type} alert-main alert-dismissible fade show" role="alert">
        <strong> ${error} </strong><br>
        Pls try again later
        <button type="button" class="close btn-close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>`;

  return template;
}
