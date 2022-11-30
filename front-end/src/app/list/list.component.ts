import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

const WATCHING: any[] = 
[
	{
    id: 129,
		title: 'Spirited Away',
		progress: 0,
    total_episodes: 1,
		rating: 8.5,
		media_type: 'movie',
    completed: '-',
    rewatching: false,
    seasons: []
	},
	{
    id: 94605,
		title: 'Arcane',
		progress: 30,
    total_episodes: 67,
		rating: 8.7,
		media_type: 'tv',
    completed: '-',
    rewatching: false
	},
];

const COMPLETED: any[] = [
  {
    id: 1438,
    title: 'The Wire',
    progress: 60,
    total_episodes: 60,
    rating: 8.5,
    media_type: 'tv',
    completed: '11/28/2022',
    rewatching: false
  },
  {
    id: 155,
    title: 'The Dark Knight',
    progress: 1,
    total_episodes: 1,
    rating: 8.5,
    media_type: 'movie',
    completed: '11/27/2022',
    rewatching: true
  }
];

// https://api.themoviedb.org/3/search/multi?api_key=265a628f356b4c5af69f159234746fce&language=en-us&query=arcane&page=1
// https://api.themoviedb.org/3/movie/" + value + "?api_key=265a628f356b4c5af69f159234746fce&language=en-US
// https://api.themoviedb.org/3/tv/" + value + "?api_key=265a628f356b4c5af69f159234746fce&language=en-US

const API_KEY = "265a628f356b4c5af69f159234746fce";
const MDB_SEARCH_STRING = "https://api.themoviedb.org/3/search/multi?api_key=" + 
  API_KEY + "&language=en-us&query=";

const MDB_INFO_STRING_START = "https://api.themoviedb.org/3/" 
const MDB_INFO_STRING_END = "?api_key=" + API_KEY + "&language=en-us";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit 
{
  page = 1;
	pageSize = 10;
	collectionSize = WATCHING.length;
	watchingList: any = [];
  completedList: any = COMPLETED;
  searchList: any = [];
  modalRef: MdbModalRef<ModalComponent> | null = null;

  searchForm = new FormGroup(
    {
      search: new FormControl<string> ('', [Validators.required, Validators.minLength(2)]),
    });
  
  constructor(private http: HttpClient, private modalService: MdbModalService) 
  {
    this.refreshList();
    /*
     TODO populate watching and completed lists. from our back-end..
     when a movie / tv show is added to the watching list copy the id, name, etc 
     over to our database from the remote source so that we can limit api calls 

     TODO refresh total number of episodes to make sure we are current?
    */
  }

  ngOnInit(): void 
  {
  }

  get search()
  {
    return this.searchForm.get('search')?.value;
  }

  refreshList()
  {
    // TODO add logic to populate the watching and completed lists. we can use the api calls to deal with pages?

		this.watchingList = WATCHING.map((list, i) => ({ id: i + 1, ...list })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}
  
  submit(e: Event)
  {
    e.preventDefault();
    var result: any;

    this.http.get(MDB_SEARCH_STRING + this.search)
      .subscribe(response =>
        {
          result = response;
          // movie db multi search gives actors too for now we'll remove them from the results. using the 
          // multi search allows us to get tv shows and movies without having to do multiple calls to the api
          for (var i = 0; i < result.results.length; i++) 
          {
            if (result.results[i].media_type === "person")
            {
              result.results.splice(i, 1);
              i--;
            }
          }
          this.searchList = result.results;
        });
    this.searchForm.get('search')?.setValue('');
  }


  // need to know if it's a movie or a tv series because the link format changes
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

  getListNames(list: any[]) :string
  {
    var result = [];
    for (var i = 0; i < list.length; i++)
    {
      result.push(list[i].name)
    }
    return result.join(", ");
  }

  getEpisodeCount(seasons: any[]) :number
  {
    var result = 0;
    for (var i = 0; i < seasons.length; i++)
    {
      result += seasons[i].episode_count;
    }
    return result;
  }

  updateProgress(id: number, n: number)
  {
    // TODO update this so it pushes the progress to the backend
    // this.http.put('url', 'body').subscribe(response => {});
    this.watchingList.forEach((element: any) => 
    {
      if (element.id == id && element.progress + n <= element.total_episodes 
            && element.progress + n >= 0)
      {
        element.progress += n;
        if (element.progress == element.total_episodes)
        {
          // TODO move item to completed list
          console.log('TODO: completed...')
        }
      }
    });
  }
}
