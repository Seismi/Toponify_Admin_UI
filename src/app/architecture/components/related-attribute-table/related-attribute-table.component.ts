import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-related-attribute-table',
  templateUrl: './related-attribute-table.component.html',
  styleUrls: ['./related-attribute-table.component.scss']
})
export class RelatedAttributeTableComponent {
  @Input() isEditable: boolean;
  @Input() selectedRelatedIndex: string | null;
  @Input() selectAttribute: boolean;

  @Input()
  set data(data: CustomPropertiesEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<CustomPropertiesEntity>(data);
  }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<CustomPropertiesEntity>;

  @Output() addRelatedAttribute = new EventEmitter<void>();

  @Output() deleteRelatedAttribute = new EventEmitter<void>();

  @Output() selectRelatedAttribute = new EventEmitter<string>();

  onAdd(): void {
    this.addRelatedAttribute.emit();
  }

  onDelete(): void {
    this.deleteRelatedAttribute.emit();
  }

  onSelect(relatedAttributeId: string): void {
    this.selectRelatedAttribute.emit(relatedAttributeId);
  }
}
