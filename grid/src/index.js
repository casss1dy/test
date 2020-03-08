import './sass/style.scss';
import $ from 'jquery';

import TableController from './js/controllers/table';
import TableView from './js/views/table';

import SpinnerController from './js/controllers/spinner';
import SpinnerView from './js/views/spinner';

import ModalView from './js/views/modal';
import ModalController from './js/controllers/modal';

import FilterView from './js/views/filter';
import FilterController from './js/controllers/filter';

import FormView from './js/views/form';
import FormController from './js/controllers/form';

import AlertView from './js/views/alert';
import AlertController from './js/controllers/alert';

$(() => {

  let spinner = new SpinnerController(new SpinnerView());
  let alert = new AlertController(new AlertView());
  let filter = new FilterController(new FilterView());
  let form = new FormController(new FormView());

  let modalView = new ModalController(new ModalView('view'));
  let modalDelete = new ModalController(new ModalView('delete'));
  let modalChange = new ModalController(new ModalView('change'));

  let tableView = new TableView();
  let tableController = new TableController(tableView);

});

$(window).on('beforeunload', function(){
  delete sessionStorage.sort;
  delete sessionStorage.filter;
  delete sessionStorage.delivery;
});













