import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  public resetPasswordEmail!:string;
  public isValidEmail!:boolean;

  constructor(
    private fb: FormBuilder , 
    private authService : AuthService ,
     private route : Router ,
      private userStore : UserStoreService,
      private resetPasswordService : ResetPasswordService
      ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }


onLogin(){
  this.authService.login(this.loginForm.value).subscribe({
    next:(res)=>{
      console.log("🚀 ~ file: login.component.ts:39 ~ LoginComponent ~ this.authService.login ~ res:", res)
      alert(res.message);
      this.loginForm.reset();
      this.authService.storeToken(res.token);
      this.authService.storeUser(res.user);
      const tokenPlayload = this.authService.decodedToken();
      this.userStore.setFullNameFromStore(tokenPlayload.unique_name);
      this.userStore.setRoleFromStore(tokenPlayload.role);
      if(tokenPlayload.role =='User'){this.route.navigate(['dashboard'])};
      if(tokenPlayload.role =='Admin'){this.route.navigate(['employees'])};

    },
    error:(err)=>{
      alert(err.error.message)

    }
  })
}

checkValidEmail( event : string){
  const value=event;
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

  this.isValidEmail = pattern.test(value);
  return this.isValidEmail;

}


confirmToSend(){
  if(this.checkValidEmail(this.resetPasswordEmail)){
    this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
      next:(res)=>{
        this.resetPasswordEmail="";
        const buttonRef=document.getElementById('closeBtn');
        buttonRef?.click();
      },
      error:(err)=>{
        alert(err);
      }
    });
  }
}


}
