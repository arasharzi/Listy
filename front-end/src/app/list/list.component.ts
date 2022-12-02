import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UserService } from '../services/user.service';

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
      search: new FormControl<string> ('', [Validators.required, Validators.minLength(1)]),
    });
  
  constructor(private user: UserService, private modalService: MdbModalService) 
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
  { }

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
    this.user.getSearchResults(this.search ?? '')
        .subscribe(
          {
            next: data =>
            {
              var result = JSON.parse(data);
              
              // remove actors and acresses from the search results.
              for (var i = 0; i < result.results.length; i++)
              {
                if (result.results[i].media_type === "person")
                {
                  result.results.splice(i, 1);
                  i--;
                }
              }
              this.searchList = result.results;
            }            
          });
    this.searchForm.get('search')?.setValue('');
  }


  // need to know if it's a movie or a tv series because the link format changes
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
