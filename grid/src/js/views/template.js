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
