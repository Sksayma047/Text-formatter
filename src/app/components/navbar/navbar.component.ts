import { Component } from '@angular/core';
import { TextStatsService } from '../../services/text-stats.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // Subscribe to live stats from the service
  wordCount$: Observable<number>;
  charCount$: Observable<number>;

  constructor(private statsService: TextStatsService) {
    this.wordCount$ = this.statsService.wordCount$;
    this.charCount$ = this.statsService.charCount$;
  }
}
