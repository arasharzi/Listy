import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'

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

// https://api.themoviedb.org/3/search/multi?api_key=265a628f356b4c5af69f159234746fce&language=en-us&query=arcane&page=2

const API_KEY = '265a628f356b4c5af69f159234746fce';
const MDB_SEARCH_STRING = "https://api.themoviedb.org/3/search/multi?api_key=" + 
  API_KEY + "&language=en-us&query=";


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

  searchForm = new FormGroup(
    {
      search: new FormControl<string> ('', [Validators.required, Validators.minLength(2)]),
    });
  
  constructor(private http: HttpClient) 
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
          this.searchList = result.results
        });
    this.searchForm.get('search')?.setValue('');
  }
}
