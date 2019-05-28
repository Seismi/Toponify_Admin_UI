import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'smi-documentation-standards-detail',
  templateUrl: 'documentation-standards-detail.component.html',
  styleUrls: ['documentation-standards-detail.component.scss']
})
export class DocumentationStandardsDetailComponent {

  @Input() group: FormGroup;

}