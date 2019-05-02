import { Component, Input } from '@angular/core';

@Component({
  selector: 'smi-layouts-detail',
  templateUrl: './layouts-detail.component.html',
  styleUrls: ['./layouts-detail.component.scss']
})
export class LayoutsDetailComponent {

  @Input() layoutSelected = false;
  
}