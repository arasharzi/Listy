import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UserService } from '../services/user.service';

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

  constructor(private user: UserService, private modalService: MdbModalService) 
  { 
    user.getTrendingMovies()
        .subscribe(
          {
            next: data =>
            {
              this.trending_movies = JSON.parse(data).results;
              this.trending = this.trending_movies;
            }
          });
    user.getTrendingTv()
        .subscribe(
          {
            next: data =>
            {
              this.trending_tv = JSON.parse(data).results;
            }
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
    this.user.getInfo(id, type)
    .subscribe(
      {
        next: data =>
        {
          var result = JSON.parse(data)
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
        }
      });
  }
}
