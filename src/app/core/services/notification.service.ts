import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`/notifications`);
  }
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/notifications/${id}`);
  }
  markAsRead(id: string): Observable<any> {
    return this.http.post<any>(`/notifications/${id}/markRead`, {});
  }
  markAllAsRead(): Observable<any> {
    return this.http.post<any>(`/notifications/markRead/all`, {});
  }
  deleteAll(): Observable<any> {
    return this.http.delete<any>(`/notifications`);
  }
}
