import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Route, Router, RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  public apiUrl = 'http://127.0.0.1:8000/api';

  /**
   * Save the access token to localStorage
   */
  setLoginData(token: string, role:string, id: string): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('id', id);
  }

  /**
   * Retrieve the access token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getID(): number | null {
    const id = localStorage.getItem('id');
    return id ? parseInt(id, 10) : null; // Convert string back to number
  }

    /**
   * Remove the access token from localStorage
   */
    clearUserData(): void {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
    }

    public getAuthHeaders(): HttpHeaders {
      const token = this.getToken();
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }

    InternOrRecruiter(role: string) {
      if (role === 'user') {
        this.router.navigateByUrl('/homepage'); // Adjust this path as per your routes
      } else if (role === 'admin') {
        this.router.navigateByUrl('/admin/dashboard'); // Adjust this path as per your routes
      } else {
        this.router.navigateByUrl('/login'); // Redirect to a fallback (e.g., login) for invalid roles
      }
    }
    // specializations/post

    getSpecializations(): Observable<any> {
      const headers = this.getAuthHeaders(); // Ensure this method returns the correct headers with the token
      return this.http.get<any>(`${this.apiUrl}/specializations/post`, { headers });
    }

    getMyData(id: number): Observable<any> {
      const headers = this.getAuthHeaders();
      return this.http.get<any>(`${this.apiUrl}/mydata/${id}`, { headers });
    }

    registerIntern(user: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<any>(`${this.apiUrl}/register/intern`, user, { headers });
    }
    registerRecruiter(user: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<any>(`${this.apiUrl}/register/recruiter`, user, { headers });
    }
    login(user: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<any>(`${this.apiUrl}/login`, user, { headers });
    }
    updateProfile(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/updateProfile`, data, { headers });
}
    getMyFilterForums(user_id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/specializations/myFilter/${user_id}`, { headers });
}





}
