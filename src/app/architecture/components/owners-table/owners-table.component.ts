import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-owners-table-in-architecture',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {
  @Input() data: any;
  @Input() workPackageIsEditable: boolean;

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  onAdd(): void {
    this.add.emit();
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }
}
