import eventEmitter, {FILTER, RENDER} from "../ee";

export default class FilterController {
  constructor(view) {
    let self = this;
    self.view = view;

    eventEmitter.on(FILTER, async ({filter}) => await self.triggerFilter({filter}));
  }

  async triggerFilter({filter}) {
    let self = this;

    if (filter) {
      filter = this.stripTags(filter);
    }

    self.view.filterStr = filter;
    self.view.toggleResetBtn();

    eventEmitter.emit(RENDER, {filter: self.filter(filter)});
  }

  stripTags(str) {

    str = str.trim();
    str = str.replace(/<br>/gi, "\n");
    str = str.replace(/<p.*>/gi, "\n");
    str = str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
    str = str.replace(/<(?:.|\s)*?>/g, "");

    str = str.trim();

    return str;
  }

  filter(str) {
    sessionStorage.filter = str;

    if (!str) return '';

    return function(data) {
      return data.filter((item) => {
        let name = item.name.toLowerCase();
        return name.includes(str.toLowerCase());
      })
    }
  }
}


