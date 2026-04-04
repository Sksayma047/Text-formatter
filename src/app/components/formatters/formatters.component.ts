import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TextStatsService } from '../../services/text-stats.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-formatters',
  templateUrl: './formatters.component.html',
  styleUrls: ['./formatters.component.css']
})
export class FormattersComponent {

  @Input() textColor: string = '#222222';

  // Live stats — initialized inline (fixes strict mode red lines)
  wordCount$: Observable<number> = this.statsService.wordCount$;
  charCount$: Observable<number> = this.statsService.charCount$;

  constructor(private statsService: TextStatsService) {}

  @Output() clearAll           = new EventEmitter<void>();
  @Output() removeExtraSpaces  = new EventEmitter<void>();
  @Output() reverseSentence    = new EventEmitter<void>();
  @Output() removeSpecialChars = new EventEmitter<void>();
  @Output() capitalizeWords    = new EventEmitter<void>();
  @Output() toggleBold         = new EventEmitter<void>();
  @Output() toggleItalic       = new EventEmitter<void>();
  @Output() toggleUnderline    = new EventEmitter<void>();
  @Output() colorChange        = new EventEmitter<string>();
  @Output() removeStyling      = new EventEmitter<void>();
  @Output() increaseFontSize   = new EventEmitter<void>();
  @Output() decreaseFontSize   = new EventEmitter<void>();

  onColorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.colorChange.emit(input.value);
  }
}
