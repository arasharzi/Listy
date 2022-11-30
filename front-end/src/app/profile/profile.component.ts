import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

const API_KEY = '265a628f356b4c5af69f159234746fce'
const API_TRENDING_MOVIE = 'https://api.themoviedb.org/3/trending/movie/week?api_key=' + API_KEY;
const API_TRENDING_TV ='https://api.themoviedb.org/3/trending/tv/week?api_key=' + API_KEY;
const MDB_INFO_STRING_START = "https://api.themoviedb.org/3/" 
const MDB_INFO_STRING_END = "?api_key=" + API_KEY + "&language=en-us";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit 
{
  modalRef: MdbModalRef<ModalComponent> | null = null;
  moviesActive: boolean = true;
  tvActive: boolean = false;
  
  trending_movies: any[] = [];
  trending_tv: any[] = [];
  trending: any[] = [];

  constructor(private http: HttpClient, private modalService: MdbModalService) 
  { 
    var result: any;
    this.http.get(API_TRENDING_MOVIE)
      .subscribe(response =>
        {
          result = response;
          this.trending_movies = result.results;
          this.trending = this.trending_movies;
        });
    this.http.get(API_TRENDING_TV)
      .subscribe(response =>
        {
          result = response;
          this.trending_tv = result.results;
        });
  }

  ngOnInit(): void 
  {  }

  setActive(str: string) :void
  {
    switch (str)
    {
      case 'movies':
        {
          if (!this.moviesActive)
          {
            this.trending = this.trending_movies;
            this.tvActive = false;
          }
          this.moviesActive = true;
          break;
        }
      case 'tv':
        {
          if (!this.tvActive)
          {
            this.trending = this.trending_tv;
            this.moviesActive = false;
          }
          this.tvActive = true;
          break;
        }
    }
  }

  getListNames(list: any[]) :string
  {
    var result = [];
    for (var i = 0; i < list.length; i++)
    {
      result.push(list[i].name)
    }
    return result.join(", ");
  }

  openModal(id: number, type: string, list?: boolean) 
  {
    var result: any;
    this.http.get(MDB_INFO_STRING_START + type + "/" + id + MDB_INFO_STRING_END)
      .subscribe(response =>
      {
        result = response;
        this.modalRef = this.modalService.open(ModalComponent,
        {
          modalClass: 'modal-xl',
          data: 
          {
            id: result.id,
            title: result.title || result.name,
            original_title: result.original_title || result.original_name,
            image: result.backdrop_path,
            poster_path:  result.poster_path,
            rating: result.vote_average.toFixed(1),
            genres: this.getListNames(result.genres),
            production_companies: this.getListNames(result.production_companies),
            runtime: result.runtime || result.episode_run_time,
            overview: result.overview,
            imdb_id: result.imdb_id,
            cast: '',
            release_date:  result.release_date || result.first_air_date,
            homepage:  result.homepage,

            list: list
          },
        });
      })
  }
}
