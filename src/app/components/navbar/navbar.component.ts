import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public router: Router) {}

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url.startsWith(path);
  }
}