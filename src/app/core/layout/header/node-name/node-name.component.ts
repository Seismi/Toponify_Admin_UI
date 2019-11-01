import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'smi-node-name',
  templateUrl: './node-name.component.html',
  styleUrls: ['./node-name.component.scss']
})
export class NodeNameComponent implements OnInit {

  @Input() parentName: string;

  constructor() { }

  ngOnInit() { }

}