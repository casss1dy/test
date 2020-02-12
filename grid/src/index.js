import './style.css';

$(document).ready(function(){

  $('.btn-edit').on('click', toggleModal);
  $('.modal-edit .close').on('click', toggleModal);

  function toggleModal() {
    $('body').toggleClass('backdrop');
    $('.modal-edit').fadeToggle();
  }

});
