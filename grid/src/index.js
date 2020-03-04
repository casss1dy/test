import './sass/style.scss';
import $ from 'jquery';

import './js/controllers/form';

import TableController from './js/controllers/table';
import TableView from './js/views/table';

$(() => {
  let view = new TableView();
  let controller = new TableController(view);
});


// Q
import FilterController from './js/controllers/filter';
const filterController = new FilterController();

import FilterView from './js/views/filter';
export const filterView = new FilterView();

import ModalView from './js/views/modal';
export const modalView = new ModalView();

import ModalController from './js/controllers/modal';
const modalController = new ModalController();









