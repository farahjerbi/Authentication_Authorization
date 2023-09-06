import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  baseApiUrl : string = environment.baseApiUrl;

  constructor(private http : HttpClient , private router :Router) { }

  getBooksByUser(id:number):Observable<Book[]>{
    return this.http.get<Book[]>(this.baseApiUrl + 'api/Book/'+id);
  }

  addBook(book : Book):Observable<Book>{
    return this.http.post<Book>(this.baseApiUrl + 'api/Book' , book);
  }
}
