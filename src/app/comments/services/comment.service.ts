import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentApiResponse, AddCommentApiRequest, AddCommentApiResponse, AddReplyCommentApiResponse, AddReplyCommentApiRequest, ArchiveCommentApiRequest, ArchiveCommentApiResponse } from '../store/models/comment.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(versionId: string): Observable<CommentApiResponse> {
    return this.http.get<CommentApiResponse>(`/${versionId}/comment/`);
  }

  getReplyComments(versionId: string, commentId: string): Observable<CommentApiResponse> {
    return this.http.get<CommentApiResponse>(`/${versionId}/comment/${commentId}`);
  }

  addComment(comment: AddCommentApiRequest, versionId: string): Observable<AddCommentApiResponse> {
    return this.http.post<any>(`/${versionId}/comment`, comment, httpOptions);
  }

  addReplyComment(comment: AddReplyCommentApiRequest, versionId: string, commentId: string): Observable<AddReplyCommentApiResponse> {
    return this.http.post<any>(`/${versionId}/comment/${commentId}/reply`, comment, httpOptions);
  }

  archiveComment(comment: ArchiveCommentApiRequest, versionId: string, commentId: string): Observable<ArchiveCommentApiResponse> {
    return this.http.post<any>(`/${versionId}/comment/${commentId}/reply`, comment, httpOptions);
  }

}
