import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { register } from 'swiper/element/bundle';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public users :any=[];
  public fullName : string ="";
  public role! : string;
  imageBaseUrl=environment.baseApiUrl+'resources/';
  Books : Book[]=[];
  userId:any;

  constructor(private authService : AuthService , 
    private apiService :ApiService ,
     private store : UserStoreService,
     private bookService :BookService,
     private router : Router
     ) { }

  ngOnInit(): void {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userId = user ? user.id : null;
    console.log('userId:', userId);
    
    this.apiService.getUsers().subscribe(res=>{
      this.users = res;
    });
    this.store.getfullNameFromStore().subscribe(
      val=>{
        const fullNameFromToken = this.authService.getFullNameFromToken();
        this.fullName= val || fullNameFromToken
      }
    );
     this.store.getRoleFromStore().subscribe(val=>{
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
     })

     this.bookService.getBooksByUser(userId).subscribe({
      next: (books) => {
        this.Books = books.map((book) => ({
          idBook: book.idBook,
          title: book.title,
          authorName: book.authorName,
          description: book.description,
          releaseDate: book.releaseDate,
          category: book.category,
          imageFile: book.imageFile,
          image: book.image
        }));
        console.log(this.Books);
      },
      error: (response) => {
        console.log(response);
      }
    });
    

  }


  logout(){
    this.authService.signOut();
  }

  login(){
    this.router.navigate(['addBook']);
  }

}



