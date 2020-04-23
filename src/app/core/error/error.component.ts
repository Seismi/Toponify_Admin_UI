import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export enum ErrorTypes {
  NO_ACCESS = '403'
}

@Component({
  selector: 'smi-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  public Types = ErrorTypes;
  public type: ErrorTypes | null;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.type = params['type'];
    });
  }
}
