import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!:FormGroup;
  imageFile?:File;
  constructor(private fb:FormBuilder , private authService : AuthService , private route : Router) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      email:['', Validators.required],
      imageFile:[null],
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }

  onSignup(){
      const frmData:User= Object.assign(this.signUpForm.value);
      frmData.imageFile=this.imageFile;
       this.authService.signup(frmData).subscribe({
      next:(res)=>{
        alert(res.message);
        this.signUpForm.reset();
        this.route.navigate(['login'])

      },error:(error)=>{
        alert(error.message)
        console.log("🚀 ~ file: sign-up.component.ts:34 ~ SignUpComponent ~ this.authService.signup ~ err:", error)

      }
    })
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }
}
