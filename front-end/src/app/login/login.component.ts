import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const API_STRING = "";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit 
{
  constructor(private http: HttpClient) { }

  ngOnInit(): void 
  { }
  
  email_addressPattern: string = "^[a-zA-Z0-9.! #$%&'+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+){1,2}$";

  loginform = new FormGroup(
    {
      email_address: new FormControl<string> ('', [Validators.required, Validators.pattern(this.email_addressPattern)]),
      password: new FormControl<string> ('', [Validators.required, Validators.minLength(8)])
    });
 
  get email_address()
  {
    return this.loginform.get('email_address')?.value;
  }

  get password()
  {
    return this.loginform.get('password')?.value;
  }

  submit(e: Event)
  {
    e.preventDefault();
    
    

  }
}
