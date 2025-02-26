import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class SocialService {

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) { }

  public apiUrl = 'http://127.0.0.1:8000/api';


  createForum(data: any): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
    return this.http.post<any>(`${this.apiUrl}/forum`, data, { headers });
}

  getForums(): Observable<any> {
  const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
  return this.http.get<any>(`${this.apiUrl}/forum`, { headers });
}

  likePost(data:any): Observable<any> {
  const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
  return this.http.post<any>(`${this.apiUrl}/like/forum`, data, { headers });
}

  addComment(data: any): Observable<any> {
  const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
  return this.http.post<any>(`${this.apiUrl}/comment`, data, { headers });
}
  addReply(data: any): Observable<any> {
  const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
  return this.http.post<any>(`${this.apiUrl}/reply`, data, { headers });
}

getComments(forumId:any): Observable<any> {
  const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
  return this.http.get<any>(`${this.apiUrl}/comments/${forumId}`, { headers });
}


// getMyForumById(id:any): Observable<any> {
//   const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
//   return this.http.get<any>(`${this.apiUrl}/user/${id}/forums`, { headers });
// }

getMyInterviews(id: any): Observable<any> {
  const headers = this.authService.getAuthHeaders();
  return this.http.get<any>(`${this.apiUrl}/interviews/${id}}`, { headers });
}


getMyForumById(id: number): Observable<any> {
  const headers = this.authService.getAuthHeaders(); // Ensure this method returns the correct headers with the token
  return this.http.get<any>(`${this.apiUrl}/user/${id}/forums`, { headers });
}


}
