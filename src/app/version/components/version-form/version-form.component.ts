import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-version-form',
  templateUrl: 'version-form.component.html',
  styleUrls: ['version-form.component.scss']
})

export class VersionFormComponent implements OnInit {

  public versionStatus = ['active', 'archived'];

  @Input() group: FormGroup;

  constructor() { }

  ngOnInit() { }
}
