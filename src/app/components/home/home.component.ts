import { Component } from '@angular/core';
import { RemoveSpecialCharsPipe } from '../../pipes/remove-special-chars.pipe';
import { TextStatsService } from '../../services/text-stats.service';

/**
 * HomeComponent — Parent
 * ----------------------
 * Owns the master `text` and `outputText` state.
 * Passes data down to children via @Input.
 * Receives formatter commands from children via @Output.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RemoveSpecialCharsPipe] // Inject pipe for programmatic use
})
export class HomeComponent {

  /** Raw input text — bound to TextDisplay's textarea */
  inputText: string = '';

  /** Processed output text — passed to TextDisplay for preview */
  outputText: string = '';

  /** Styling state passed down to TextDisplay */
  isBold: boolean      = false;
  isItalic: boolean    = false;
  isUnderline: boolean = false;
  textColor: string    = '#e8e8f0';
  fontSize: number     = 16;

  constructor(
    private pipe: RemoveSpecialCharsPipe,
    private statsService: TextStatsService
  ) {}

  // Called by TextDisplay when user types
  onInputChange(text: string): void {
    this.inputText  = text;
    this.outputText = text; // live mirror by default
    this.statsService.updateStats(text);
  }

  // Called by Formatters child via @Output

  onClearAll(): void {
    this.inputText  = '';
    this.outputText = '';
    this.statsService.reset();
  }

  onRemoveExtraSpaces(): void {
    this.outputText = this.outputText.replace(/\s+/g, ' ').trim();
    this.statsService.updateStats(this.outputText);
  }

  onReverseSentence(): void {
    this.outputText = this.outputText.split(' ').reverse().join(' ');
  }

  onRemoveSpecialChars(): void {
    // Use the custom pipe
    this.outputText = this.pipe.transform(this.outputText);
    this.statsService.updateStats(this.outputText);
  }

  onCapitalizeWords(): void {
    this.outputText = this.outputText
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  // Styling events
  onToggleBold(): void      { this.isBold      = !this.isBold; }
  onToggleItalic(): void    { this.isItalic    = !this.isItalic; }
  onToggleUnderline(): void { this.isUnderline = !this.isUnderline; }

  onColorChange(color: string): void { this.textColor = color; }

  onRemoveStyling(): void {
    this.isBold      = false;
    this.isItalic    = false;
    this.isUnderline = false;
    this.textColor   = '#e8e8f0';
    this.fontSize    = 16;
  }

  onIncreaseFontSize(): void { if (this.fontSize < 48) this.fontSize += 2; }
  onDecreaseFontSize(): void { if (this.fontSize > 10) this.fontSize -= 2; }
}
