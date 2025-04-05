import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  useform: FormGroup;

  constructor(private fb: FormBuilder){
    this.useform= this.fb.group({
      email: ['', [Validators.required,  Validators.email]],
      password: ['', [Validators.required,  Validators.minLength(8)]],
      phoneNumber: ['', [Validators.required,  Validators.minLength(9)]],
    })
  }
  
  onSubmit(){
    if(this.useform.valid){
      console.log('მონაცემები:', this.useform.value)
    }else{
      console.log('ფორმის შევსება ვერ მოხერხდა')
    }
  }
}
