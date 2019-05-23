import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-add-attr-and-rules',
  templateUrl: './add-attr-and-rules.component.html',
  styleUrls: ['./add-attr-and-rules.component.scss']
})
export class AddAttrAndRulesComponent {

  constructor() { }

  @Output()
  addAttribute = new EventEmitter();

  @Output()
  addRule = new EventEmitter();

  onAddAttribute(){
    this.addAttribute.emit();
  }

  onAddRule(){
    this.addRule.emit();
  }

}