import { Component } from '@angular/core';
import { RemoveSpecialCharsPipe } from '../../pipes/remove-special-chars.pipe';
import { TextStatsService } from '../../services/text-stats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RemoveSpecialCharsPipe]
})
export class HomeComponent {

  inputText: string  = '';
  outputText: string = '';

  isBold: boolean      = false;
  isItalic: boolean    = false;
  isUnderline: boolean = false;
  textColor: string    = '#111111';   
  fontSize: number     = 16;

  constructor(
    private pipe: RemoveSpecialCharsPipe,
    private statsService: TextStatsService
  ) {}

  onInputChange(text: string): void {
    this.inputText  = text;
    this.outputText = text;
    this.statsService.updateStats(text);
  }

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
    this.outputText = this.outputText.split('').reverse().join('');
  }

  onRemoveSpecialChars(): void {
    this.outputText = this.pipe.transform(this.outputText);
    this.statsService.updateStats(this.outputText);
  }


  onCapitalizeWords(): void {
    this.outputText = this.outputText.toUpperCase();
  }

  onToggleBold(): void      { this.isBold      = !this.isBold; }
  onToggleItalic(): void    { this.isItalic    = !this.isItalic; }
  onToggleUnderline(): void { this.isUnderline = !this.isUnderline; }

  onColorChange(color: string): void { this.textColor = color; }

  onRemoveStyling(): void {
    this.isBold      = false;
    this.isItalic    = false;
    this.isUnderline = false;
    this.textColor   = '#111111';   
    this.fontSize    = 16;
  }

  onIncreaseFontSize(): void { if (this.fontSize < 48) this.fontSize += 2; }
  onDecreaseFontSize(): void { if (this.fontSize > 10) this.fontSize -= 2; }
}
