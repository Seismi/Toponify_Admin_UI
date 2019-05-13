import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(versionId: string): Observable<any> {
    return this.http.get<any>(`/${versionId}/comment/`);
  }

  getReplyComments(versionId: string, commentId: string): Observable<any> {
    return this.http.get<any>(`/${versionId}/comment/${commentId}`);
  }

  addComment(comment: any, versionId: string): Observable<any> {
    return this.http.post<any>(`/${versionId}/comment`, comment, httpOptions);
  }

  addReplyComment(comment: any, versionId: string, commentId: string): Observable<any> {
    return this.http.post<any>(`/${versionId}/comment/${commentId}/reply`, comment, httpOptions);
  }

  archiveComment(comment: any, versionId: string, commentId: string): Observable<any> {
    return this.http.post<any>(`/${versionId}/comment/${commentId}/reply`, comment, httpOptions);
  }

}
