import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'Listy';
  homeActive: boolean = true
  listActive: boolean = false
  placeholderActive: boolean = false
  logoutActive: boolean = false



  constructor() { }

  ngOnInit(): void 
  {
  }

  navigate(e: Event)
  {
    switch((e.target as Element).id)
    {
      case 'home':
        if (!this.homeActive)
        {
          this.homeActive = true
          this.listActive = false
          this.placeholderActive = false
          this.logoutActive = false
        }
        break
      case 'list':
        if (!this.listActive)
        {
          this.homeActive = false
          this.listActive = true
          this.placeholderActive = false
          this.logoutActive = false
        }
        break
      case 'placeholder':
        if (!this.placeholderActive)
        {
          this.homeActive = false
          this.listActive = false
          this.placeholderActive = true
          this.logoutActive = false
        }
        break
      case 'logout':
        if (!this.logoutActive)
        {
          this.homeActive = false
          this.listActive = false
          this.placeholderActive = false
          this.logoutActive = true
        }
        break
    }
  }

  getActive(s: string) :string
  {
    switch(s)
    {
      case 'home':
        if (this.homeActive)
        {
          return 'active'
        }
        return ''
      case 'list':
        if (this.listActive)
        {
          return 'active'
        }
        return ''
      case 'placeholder':
        if (this.placeholderActive)
        {
          return 'active'
        }
        return ''
      case 'logout':
        if (this.logoutActive)
        {
          return 'active'
        }
        return ''
    }
    return ''
  }

  public get home() :boolean
  {
    return this.homeActive
  }

  public get list() :boolean
  {
    return this.listActive
  }

  public get placeholder(): boolean
  {
    return this.placeholderActive
  }

  public get logout(): boolean
  {
    return this.logoutActive
  }

}
