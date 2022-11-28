import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit 
{
  id: number | null = null;
  title: string | null = null;
  original_title: string | null = null;
  image: string | null = null;
  poster_path:  string | null = 'n/a';
  rating: string | null = 'n/a';
  genres: string | null = null;
  production_companies: string | null = null;
  runtime: string | null = 'n/a';
  overview: string | null = 'n/a';
  imdb_id: string | null = 'n/a';
  cast: string | null = 'n/a';
  release_date:  string | null = 'n/a';
  homepage:  string | null = 'n/a';
  


  constructor(public modalRef: MdbModalRef<ModalComponent>) 
  {

  }

  ngOnInit(): void 
  {
  }

}
