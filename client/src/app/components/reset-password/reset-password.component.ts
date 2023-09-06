import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import validateForm from 'src/app/helpers/validateForm';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj = new ResetPassword();

  constructor( private fb : FormBuilder , 
    private activatedRoute :ActivatedRoute,
    private resetService: ResetPasswordService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.resetForm=this.fb.group({
      password:[null , Validators.required],
      confirmPassword:[null,Validators.required]
    },{
      validator:confirmPasswordValidator("password","confirmPassword")});

      this.activatedRoute.queryParams.subscribe(val=>{
        this.emailToReset=val['email'];
        let uriToken = val['code'];
        this.emailToken=uriToken.replace(/ /g,'+');
        this.emailToken=val['code'];

      })
  }

  reset(){
    if(this.resetForm.valid){
      this.resetPasswordObj.email=this.emailToReset;
      this.resetPasswordObj.newPassword=this.resetForm.value.password;
      this.resetPasswordObj.confirmPassword=this.resetForm.value.confirmPassword;
      this.resetPasswordObj.emailToken=this.emailToken;
      this.resetService.resetEmailPassword(this.resetPasswordObj).subscribe({
        next:(res)=>{
          alert("Success");
          this.router.navigate(['/login']);
        },
        error:(err)=>{
          alert("Error");
        }
      })
    }
  }

}
