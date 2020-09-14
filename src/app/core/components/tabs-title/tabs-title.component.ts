import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'smi-tabs-title',
  templateUrl: './tabs-title.component.html',
  styleUrls: ['./tabs-title.component.scss']
})
export class TabsTitleComponent implements OnInit {
  @Input() title: string;
  @Input() reference: string;
  @Input() name: string;

  constructor() { }

  ngOnInit() { }

}
