import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

/**
 * TextDisplayComponent — Child (LEFT column)
 * ------------------------------------------
 * Receives:
 *   @Input  outputText   — processed text to show in preview
 *   @Input  styling props — bold, italic, underline, color, fontSize
 *
 * Emits:
 *   @Output inputChanged — fires on every keystroke with current value
 */
@Component({
  selector: 'app-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.css']
})
export class TextDisplayComponent implements OnChanges {

  // Inputs from Parent
  @Input() outputText:  string  = '';
  @Input() isBold:      boolean = false;
  @Input() isItalic:    boolean = false;
  @Input() isUnderline: boolean = false;
  @Input() textColor:   string  = '#111111';
  @Input() fontSize:    number  = 16;

  // Output to Parent
  @Output() inputChanged = new EventEmitter<string>();

  /** Local copy for the input textarea (ngModel) */
  localInput: string = '';

  ngOnChanges(): void {
    // When parent clears (outputText reset to ''), sync local state
    if (this.outputText === '' && this.localInput !== '') {
      this.localInput = '';
    }
  }

  /** Fires on every keystroke — emits value up to parent */
  onType(value: string): void {
    this.localInput = value;
    this.inputChanged.emit(value);
  }

  /** Computed style object for the output preview box */
  get previewStyle(): Record<string, string> {
    return {
      fontWeight:     this.isBold      ? 'bold'      : 'normal',
      fontStyle:      this.isItalic    ? 'italic'    : 'normal',
      textDecoration: this.isUnderline ? 'underline' : 'none',
      color:          this.textColor,
      fontSize:       `${this.fontSize}px`
    };
  }
}
