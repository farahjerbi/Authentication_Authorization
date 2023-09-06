import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { AddEmployeesComponent } from './components/employees/add-employees/add-employees.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AddBookComponent } from './components/books/add-book/add-book.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';

const routes: Routes = [
  {path:'',
  component:EmployeesListComponent , canActivate:[AuthGuard]},
  {path:'employees',
  component:EmployeesListComponent  , canActivate:[AuthGuard]}
  ,
  {path:'employees/add',
  component:AddEmployeesComponent  , canActivate:[AuthGuard]}
  ,
  {path:'employees/edit/:id',
  component:EditEmployeeComponent  , canActivate:[AuthGuard]},
  {path:'login',
  component:LoginComponent},
  {path:'signup',
  component:SignUpComponent},
  {path:'dashboard',
  component:DashboardComponent , canActivate:[AuthGuard]},
  {path:'reset',
  component:ResetPasswordComponent },
  {path:'addBook',
  component:AddBookComponent , canActivate:[AuthGuard]},
  {path:'DynamicForm',
  component:DynamicFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
