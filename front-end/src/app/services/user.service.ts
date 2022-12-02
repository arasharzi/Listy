import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// https://api.themoviedb.org/3/search/multi?api_key=265a628f356b4c5af69f159234746fce&language=en-us&query=arcane&page=1
// https://api.themoviedb.org/3/movie/" + value + "?api_key=265a628f356b4c5af69f159234746fce&language=en-US
// https://api.themoviedb.org/3/tv/" + value + "?api_key=265a628f356b4c5af69f159234746fce&language=en-US

const API_KEY = "265a628f356b4c5af69f159234746fce";

const MDB_SEARCH_STRING = "https://api.themoviedb.org/3/search/multi?api_key=" + 
  API_KEY + "&language=en-us&query=";

const MDB_INFO_STRING_START = "https://api.themoviedb.org/3/" 
const MDB_INFO_STRING_END = "?api_key=" + API_KEY + "&language=en-us";

const API_TRENDING_MOVIE = 'https://api.themoviedb.org/3/trending/movie/week?api_key=' + API_KEY;
const API_TRENDING_TV ='https://api.themoviedb.org/3/trending/tv/week?api_key=' + API_KEY;

const API = 'localhost:8080/api/'



@Injectable({
  providedIn: 'root'
})

export class UserService 
{
  constructor(private http: HttpClient) { }

  getWatchingList()
  {

  }

  getSearchResults()
  {

  }

  getInfo(id: number, type: string): Observable<any>
  {
    return this.http.get(MDB_INFO_STRING_START + type + "/" + id + MDB_INFO_STRING_END, { responseType: 'text' })
  }

  getTrendingMovies(): Observable<any>
  {
    return this.http.get(API_TRENDING_MOVIE, { responseType: 'text' });
  }

  getTrendingTv(): Observable<any>
  {
    return this.http.get(API_TRENDING_TV, { responseType: 'text' });
  }

  update()
  {

  }
}
