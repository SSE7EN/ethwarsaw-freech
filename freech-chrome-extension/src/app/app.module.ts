import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormsModule} from "@angular/forms";
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { EmptyBoxComponent } from './empty-box/empty-box.component';
import {NgxRerenderModule} from "ngx-rerender";

@NgModule({
    declarations: [
        AppComponent,
        CommentBoxComponent,
        EmptyBoxComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatDividerModule,
        MatProgressBarModule,
        FormsModule,
        NgxRerenderModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
