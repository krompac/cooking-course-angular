import {NgModule} from "@angular/core";
import {AlertComponent} from "./alert/alert.component";
import {DateTimePickerComponent} from "./date-time-picker/date-time-picker.component";
import {PaginationComponent} from "./pagination/pagination.component";
import {SpinnerLoaderComponent} from "./spinner-loader/spinner-loader.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ErrorStateMatcher, MatNativeDateModule, ShowOnDirtyErrorStateMatcher} from "@angular/material/core";
import {MomentDateModule} from "@angular/material-moment-adapter";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTableModule} from "@angular/material/table";
import {DropdownDirective} from "./dropdown.directive";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "../auth/auth-interceptor";

@NgModule({
  declarations: [
    AlertComponent,
    DateTimePickerComponent,
    PaginationComponent,
    SpinnerLoaderComponent,
    DropdownDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MomentDateModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  exports: [
    AlertComponent,
    DateTimePickerComponent,
    PaginationComponent,
    SpinnerLoaderComponent,
    DropdownDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MomentDateModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [{provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
})
export class SharedModule {

}
