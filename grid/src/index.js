import './sass/style.scss';
import $ from 'jquery';

import TableController from './js/controllers/table';
import TableView from './js/views/table';

import SpinnerController from './js/controllers/spinner';
import SpinnerView from './js/views/spinner';

import ModalView from './js/views/modal';
import ModalController from './js/controllers/modal';

import {MVView, MVChange, MVDelete} from './js/views/modal';
import {MCView, MCChange, MCDelete} from './js/controllers/modal';

console.log(1, MVView);

$(() => {

  let spinner = new SpinnerController(new SpinnerView());

  let modalView = new ModalController(new ModalView('view'));
  let modalDelete = new ModalController(new ModalView('delete'));

  let view = new TableView();
  let controller = new TableController(view);

  // move компоненты
});

//
import './js/controllers/form';

// Q
import FilterController from './js/controllers/filter';
const filterController = new FilterController();

import FilterView from './js/views/filter';
export const filterView = new FilterView();










