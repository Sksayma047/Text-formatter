import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // needed for ngModel

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { TextDisplayComponent } from './components/text-display/text-display.component';
import { FormattersComponent } from './components/formatters/formatters.component';

// Pipes
import { RemoveSpecialCharsPipe } from './pipes/remove-special-chars.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TextDisplayComponent,
    FormattersComponent,
    RemoveSpecialCharsPipe  // Custom pipe registered here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule             // Two-way binding support
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
