import eventEmitter, {SPINNER} from "../ee";
export default class spinnerController {
  constructor(view) {
    this.view = view;

    eventEmitter.on(SPINNER, (isToogleBackdrop) => {
      if (isToogleBackdrop === undefined) isToogleBackdrop = true;
      this.view.toggle(isToogleBackdrop);
    });
  }
}