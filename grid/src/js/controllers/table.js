import eventEmitter, {RENDER, ALERT, SORT, SPINNER} from "../ee";
import {getProductList} from "../models/model";
import $ from "jquery";

export default class TableController {
  constructor(view) {
    let self = this;
    self.view = view;

    self.render({});

    eventEmitter.on(RENDER, async (options) => {
      await self.render(options);
    });
  }

  async render({filter = null, sort = null}) {
    let self = this;
    let response;

    console.log();
    
    console.log('klfdklfkd');

    eventEmitter.emit(SPINNER);

    try {
      response = await getProductList();
    } catch (e) {
      let error = e.status ? `${e.status} ${e.statusText}` : 'Something went wrong';
      eventEmitter.emit(ALERT, error);
      return;
    } finally {
      eventEmitter.emit(SPINNER);
    }

    let data = response.Data;

    if (filter || self.filter) {
      if (!self.filter) self.filter = filter;
      data = self.filter(data);
    }

    if (sort) {
      data = self.sort(data, sort);
    } else {
      if (sessionStorage.sort) {
        data = self.sort(data, JSON.parse(sessionStorage.sort));
      }
    }

    this.view.render(data);

    console.log(data);
  }

  sort(data, {field, oldDirection, direction, $icon}) {
    let self = this;

    if (!direction) {
      direction = oldDirection === 'desc' || !oldDirection ? 'asc' : 'desc';
      sessionStorage.sort = JSON.stringify({field: field, direction: direction});
      self.view.sort(direction, oldDirection, $icon);
    } 

    let sortedData = data.sort((a, b) => {
      if (direction === 'asc') {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
      } else {
        if (a[field] < b[field]) return 1;
        if (a[field] > b[field]) return -1;
      }

      return 0;
    });

    return sortedData;
  }

}
