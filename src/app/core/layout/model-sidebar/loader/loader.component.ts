import { Component, Input, OnInit } from '@angular/core';
import { LoadingStatus } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'app-sidebar-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {

  @Input() loadingStatus: LoadingStatus;
  status = LoadingStatus;

  constructor() {}

  ngOnInit(): void {}
}
