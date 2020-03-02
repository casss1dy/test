import eventEmitter, {FILTER} from "../ee";
import {getList} from "../../index";
import {filterView} from "../view";

export default class FilterController {
  constructor() {
    eventEmitter.on(FILTER, async ({filter}) => {
      console.log(filter);

      if (filter) {
        filter = this.stripTags(filter);
      }

      filterView.filterStr = filter;
      filterView.toggleResetBtn();

      await getList(filter);
    });
  }

  stripTags(string) {
    return string.replace(/(<([^>]+)>)/ig,"");
  }
}

// todo фильтр при нажатой сортировке


