import './style.scss';

$(function(){

  /**
   * Model
   */

  function getProductList() {

  }

  /**
   * Controller
   */

  function toggleModal() {
    $('body').toggleClass('backdrop');
    $('.modal-main').fadeToggle();
  }

  /**
   * View
   */

  $('.btn-edit').on('click', toggleModal);
  $('.modal-main .close').on('click', toggleModal);

});

fetch(`https://api-crud-mongo.herokuapp.com/api/v1/products`)
  .then(response => {console.log(response.json())})
  .catch();
