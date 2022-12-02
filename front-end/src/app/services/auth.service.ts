import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'localhost:8080/api/auth';

const httpOptions = 
{
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{

  constructor(private http: HttpClient) { }

  login(email_address: string, password: string): Observable<any>
  {
    return this.http.post(
        AUTH_API + 'signin',
        {
          email_address,
          password
        },
        httpOptions
    );
  }

  logout(): Observable<any>
  {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
