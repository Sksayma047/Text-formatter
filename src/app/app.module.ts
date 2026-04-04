import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent }      from './components/navbar/navbar.component';
import { HomeComponent }        from './components/home/home.component';
import { TextDisplayComponent } from './components/text-display/text-display.component';
import { FormattersComponent }  from './components/formatters/formatters.component';
import { ApisComponent }        from './components/apis/apis.component';

import { RemoveSpecialCharsPipe } from './pipes/remove-special-chars.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TextDisplayComponent,
    FormattersComponent,
    ApisComponent,
    RemoveSpecialCharsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
