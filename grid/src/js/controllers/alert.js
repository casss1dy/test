import eventEmitter, {ALERT} from "../ee";
export default class alertController {
  constructor(view) { 
    let self = this;
    self.view = view;
    eventEmitter.on(ALERT, (text) => self.view.show(text));
  }
}