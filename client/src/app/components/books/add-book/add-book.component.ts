import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.enum';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  addBook!:FormGroup;
  imageFile?:File;
  categories = Object.keys(Category).filter((v) => isNaN(Number(v))); 



  constructor(private fb:FormBuilder , private bookService : BookService , private router : Router) { }

  ngOnInit(): void {



    this.addBook = this.fb.group({
      title:['', Validators.required],
      authorName:['', Validators.required],
      description:['', Validators.required],
      imageFile:[null],
      category:['', Validators.required],
      releaseDate:['', Validators.required]
    })
    

  }


  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  addBooks(){
   
  }

}
