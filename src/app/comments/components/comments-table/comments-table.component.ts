import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Comment } from '@app/comments/store/models/comment.model';

@Component({
  selector: 'app-comments-table',
  templateUrl: './comments-table.component.html',
  styleUrls: ['./comments-table.component.scss']
})
export class CommentsTableComponent implements OnInit {

  selectedRowIndex:number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  set data(_data: Comment[]) {
    this.dataSource = new MatTableDataSource<Comment>(_data);
  }

  displayedColumns: string[] = ['title','category','status','last_update_date','last_update_by'];
  public dataSource: MatTableDataSource<Comment>;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  @Output()
  showSelectedRowDetails = new EventEmitter<string>();

  @Output()
  addComment = new EventEmitter();

  onSelectRow(row) {
    this.showSelectedRowDetails.emit(row);
    this.selectedRowIndex = row.id;
  }

  onAdd() {
    this.addComment.emit();
  }
  
}
