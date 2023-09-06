import { Component, OnInit } from '@angular/core';
import FormJSon from '../../../assets/json/data.json';
import { FormBuilder , FormControl, FormGroup, Validators } from '@angular/forms';

export interface Options{
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?:string;
  children?:Array<FormControlObject>;
}

export interface FormControlObject{
  key:string;
  type:string;
  options:Options;
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  simpleForm = FormJSon;
  myForm!:FormGroup;
  constructor( private fb : FormBuilder ) {
    this.myForm = this.fb.group({});
    console.log("🚀 ~ file: dynamic-form.component.ts:27 ~ DynamicFormComponent ~ simpleForm:", this.simpleForm)
        //Make API Call here
    this.CreateControls(this.simpleForm);
   }

  ngOnInit(): void {



  }

  CreateControls(controls : Array<FormControlObject>){
    for ( let control of controls){
      const newFormControl = new FormControl();

      if (control.options.required){
        newFormControl.setValidators(Validators.required);
      }

      this.myForm.addControl(control.key , newFormControl);

    }

    console.log("myform" , this.myForm);
  }

  submit(){
    alert(this.myForm.value)
  }

}
