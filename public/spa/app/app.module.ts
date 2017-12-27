// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CollectionsComponent } from './collections/collections.component';
import { DataComponent } from './data/data.component';

// Services
import { DataService } from "./data.service";
import { AuthService } from "./auth.service";
import { LoggedinGuard } from './loggedin.guard';

// routing
import { routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CollectionsComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing
  ],
  providers: [
    AuthService,
    DataService,
    LoggedinGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
