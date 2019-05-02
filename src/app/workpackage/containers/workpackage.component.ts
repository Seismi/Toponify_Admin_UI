import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smi-workpackage-component',
  templateUrl: 'workpackage.component.html',
  styleUrls: ['workpackage.component.scss']
})

export class WorkpackageComponent implements OnInit {

  workpackageSelected: boolean;

  constructor() { }

  ngOnInit() { }

  onSelectWorkpackage(row) {
    this.workpackageSelected = true;
  }
}