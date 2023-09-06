import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseApiUrl : string = environment.baseApiUrl;

  constructor( private http : HttpClient) { }

  getAllEmployees() : Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseApiUrl + 'api/Employee')
  }

  addEmployees(addEmployee:Employee): Observable<Employee>{
    addEmployee.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Employee>(this.baseApiUrl + 'api/Employee' , addEmployee);
  }

  getEmployee(id:string):Observable<Employee>{
    return this.http.get<Employee>(this.baseApiUrl + 'api/Employee/'+id);
  }

  updateEmploye(id:string,employee:Employee):Observable<Employee>{
    return this.http.put<Employee>(this.baseApiUrl + 'api/Employee/'+id,employee);

  }

  deleteEmploye(id:string):Observable<Employee>{
    return this.http.delete<Employee>(this.baseApiUrl + 'api/Employee/'+id);

  }
}
