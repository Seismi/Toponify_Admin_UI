import { Component, Input } from '@angular/core';

interface TableCollapseEntry {
  level: number;
  related: any[];
  collapsed: boolean;
  category: string;
}

enum Icons {
  Collapsed = 'add_box',
  Uncollapsed = 'indeterminate_check_box',
  Empty = 'check_box_outline_blank'
}

// TODO: could be named as TableCategory

@Component({
  selector: 'app-table-collapse',
  templateUrl: './table-collapse.component.html',
  styleUrls: ['./table-collapse.component.scss']
})
export class TableCollapseComponent {
  @Input() entry: TableCollapseEntry;

  get levels(): number[] {
    return new Array(this.entry.level);
  }

  getIcon(): string {
    if (this.entry.collapsed && this.entry.related.length > 0) {
      return Icons.Collapsed;
    }
    if (!this.entry.collapsed && this.entry.related.length > 0) {
      return Icons.Uncollapsed;
    }
    return Icons.Empty;
  }
}
