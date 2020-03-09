import ee from "event-emitter";
export default ee();

export const ADD = 'product/ADD';
export const DELETE = 'product/DELETE';
export const UPDATE = 'product/UPDATE';
export const FILTER = 'product/FILTER';
export const SORT = 'product/SORT';

export const OPEN = 'modal/OPEN';
export const CLOSE = 'modal/CLOSE';

export const VALIDATE = 'form/VALIDATE'; // move to product ns?

export const LOAD = 'dom/LOAD';
export const ALERT = 'dom/ALERT';
export const SPINNER = 'dom/SPINNER';

export const RENDER = 'table/render';
export const RENDER_FORM = 'form/render';







