import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms'; // needed for ngModel
import { HttpClientModule } from '@angular/common/http'; // for API calls

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { TextDisplayComponent } from './components/text-display/text-display.component';
import { FormattersComponent } from './components/formatters/formatters.component';
import { ApisComponent } from './components/apis/apis.component';


// Pipes
import { RemoveSpecialCharsPipe } from './pipes/remove-special-chars.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TextDisplayComponent,
    FormattersComponent,
    ApisComponent,
    RemoveSpecialCharsPipe  // Custom pipe registered here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
