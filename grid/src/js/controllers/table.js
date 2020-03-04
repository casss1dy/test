import eventEmitter, {LOAD, SORT} from "../ee";
import {Alert} from "../view";
import {toggleSpinner} from "../views/spinner";
import {getProductList} from "../models/model";
import $ from "jquery";

export default class TableController {
  constructor(view) {
    let self = this;
    self.view = view;

    eventEmitter.on(LOAD, async () => {
      // this.view.init();
      await self.init();

      eventEmitter.on(SORT, async ({search = '', sort}) => {
        await self.init(search, sort);
      });
    });
  }

  async init(search = '', sort = '') {
    console.log(self.view);
    self.view.init();

    let response;

    toggleSpinner(); // TODO trigger event

    try {
      response = await getProductList();
    } catch (e) {
      new Alert({
        type: 'danger',
        error: e.status ? `${e.status} ${e.statusText}` : 'Something went wrong',
      }).show();
      return;
    } finally {
      toggleSpinner();
    }

    let data = response.Data;

    if (!$.isEmptyObject(search)) {
      data = response.Data.filter((item) => {
        let name = item.name.toLowerCase();
        return name.includes(search.toLowerCase());
      })
    }

    if (!$.isEmptyObject(sort)) {
      data = data.sort((a, b) => {
        if (sort.direction === 'asc') {
          if (a[sort.field] < b[sort.field]) return -1;
          if (a[sort.field] > b[sort.field]) return 1;
        } else {
          if (a[sort.field] < b[sort.field]) return 1;
          if (a[sort.field] > b[sort.field]) return -1;
        }

        return 0;
      });

    }

    this.view.render(data);

    console.log(data);
  }

}
