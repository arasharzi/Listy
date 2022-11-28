import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

interface List 
{
	id?: number;
	title: string;
	progress: string;
	rating: number;
	type: string;
  something: string;
}

interface SearchList
{
  id?: number;
  title: string;
  progress?: string;
  rating: number;
  type: string;
  something: string;
}

const WATCHING: List[] = 
[
	{
		title: 'Spirited Away',
		progress: '0/1',
		rating: 85,
		type: 'movie',
    something: ''
	},
	{
		title: 'Arcane',
		progress: '2/9',
		rating: 87,
		type: 'tv',
    something: ''
	},
];

// https://api.themoviedb.org/3/search/multi?api_key=265a628f356b4c5af69f159234746fce&language=en-us&query=arcane&page=1
// https://api.themoviedb.org/3/movie/" + value + "?api_key=265a628f356b4c5af69f159234746fce&language=en-US
// https://api.themoviedb.org/3/tv/" + value + "?api_key=265a628f356b4c5af69f159234746fce&language=en-US

const API_KEY = "265a628f356b4c5af69f159234746fce";
const MDB_SEARCH_STRING = "https://api.themoviedb.org/3/search/multi?api_key=" + 
  API_KEY + "&language=en-us&query=";

const MDB_INFO_STRING_START = "https://api.themoviedb.org/3/" 
const MDB_INFO_STRING_END = "?api_key=" + API_KEY + "&language=en-us";


const COMPLETED: List[] = [
  {
    title: 'something',
    progress: '12/12',
    rating: 90,
    type: 'tv',
    something: ''
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
	watchingList: List[] = [];
  completedList: List[] = COMPLETED;
  searchList: any = [];
  modalRef: MdbModalRef<ModalComponent> | null = null;

  searchForm = new FormGroup(
    {
      search: new FormControl<string> ('', [Validators.required, Validators.minLength(2)]),
    });
  
  constructor(private http: HttpClient, private modalService: MdbModalService) 
  {
    this.refreshList();
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
  openModal(id: number, type: string) 
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
            runtime: result.runtime,
            overview: result.overview,
            imdb_id: result.imdb_id,
            cast: '',
            release_date:  result.release_date || result.first_air_date,
            homepage:  result.homepage,
          },
        });
      })
  }

  getListNames(list: any) :string
  {
    var result = [];
    for (var i = 0; i < list.length; i++)
    {
      result.push(list[i].name)
    }
    console.log(result.join(", "))
    return result.join(", ");
  }

}
