import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TextStatsService } from '../../services/text-stats.service';
/**
 * FormattersComponent — Child (RIGHT column)
 * ------------------------------------------
 * Does NOT hold text state — it only emits actions UP
 * to the HomeComponent via @Output EventEmitters.
 *
 * The parent handles all text transformations.
 */
@Component({
  selector: 'app-formatters',
  templateUrl: './formatters.component.html',
  styleUrls: ['./formatters.component.css']
})
export class FormattersComponent {

  // Input from Parent
  @Input() textColor: string = '#e8e8f0';

  // Live stats from service — initialized directly as assignments
  wordCount$: Observable<number> = this.statsService.wordCount$;
  charCount$: Observable<number> = this.statsService.charCount$;

  constructor(private statsService: TextStatsService) {}


  // Outputs to Parent

  // Text Operations
  @Output() clearAll           = new EventEmitter<void>();
  @Output() removeExtraSpaces  = new EventEmitter<void>();
  @Output() reverseSentence    = new EventEmitter<void>();
  @Output() removeSpecialChars = new EventEmitter<void>();
  @Output() capitalizeWords    = new EventEmitter<void>();

  // Styling
  @Output() toggleBold         = new EventEmitter<void>();
  @Output() toggleItalic       = new EventEmitter<void>();
  @Output() toggleUnderline    = new EventEmitter<void>();
  @Output() colorChange        = new EventEmitter<string>();
  @Output() removeStyling      = new EventEmitter<void>();

  // Font Size
  @Output() increaseFontSize   = new EventEmitter<void>();
  @Output() decreaseFontSize   = new EventEmitter<void>();

  /** Relay color picker native event up to parent */
  onColorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.colorChange.emit(input.value);
  }
}
