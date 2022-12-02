import { Injectable } from '@angular/core';

const KEY = 'auth-user'

@Injectable({
  providedIn: 'root'
})

export class StorageService 
{
  constructor() { }

  clearSession(): void
  {
    window.sessionStorage.clear();
  }

  getUser(): any
  {
    var auth = window.sessionStorage.getItem(KEY);
    if (auth)
    {
      return JSON.parse(auth);
    }
    return { };
  }

  setUser(auth: any)
  {
    window.sessionStorage.removeItem(KEY);
    window.sessionStorage.setItem(KEY, JSON.stringify(auth));
  }

  isLoggedIn(): boolean
  {
    var auth = window.sessionStorage.getItem(KEY);
    if (auth)
    {
      return true;
    }
    return false;
  }
}
