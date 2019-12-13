import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-settings-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss']
})
export class SettingsRightSideComponent {
  @Input() title: string;

  @Output() add = new EventEmitter<void>();

  onAdd(): void {
    this.add.emit();
  }
}