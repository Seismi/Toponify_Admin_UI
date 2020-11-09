import {Injectable} from '@angular/core';

let thisService;

@Injectable()
export class DiagramUtilitiesService {

  constructor() {
    thisService = this;
  }

  textFont(style?: string): Object {
    const font = getComputedStyle(document.body).getPropertyValue('--default-font');
    return {
      font: `${style} ${font}`
    };
  }



}
