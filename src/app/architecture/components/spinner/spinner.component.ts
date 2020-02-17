import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  constructor(private router: Router) { }

  onCancel() {
    this.router.navigate(['/home']);
  }
}
