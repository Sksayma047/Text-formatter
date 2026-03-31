import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * TextStatsService
 * -----------------
 * Uses BehaviorSubject to reactively track word count
 * and character count. Any component can subscribe to
 * the public Observables to get live updates.
 */
@Injectable({
  providedIn: 'root' // Singleton — available app-wide
})
export class TextStatsService {

  // Private mutable subjects
  private wordCountSubject = new BehaviorSubject<number>(0);
  private charCountSubject = new BehaviorSubject<number>(0);

  // Public read-only observables for components to subscribe
  wordCount$: Observable<number> = this.wordCountSubject.asObservable();
  charCount$: Observable<number> = this.charCountSubject.asObservable();

  /**
   * Call this on every keystroke with the current text value.
   * Updates both word and character counts reactively.
   */
  updateStats(text: string): void {
    const trimmed = text.trim();

    // Character count: total length of the raw string
    this.charCountSubject.next(text.length);

    // Word count: split on whitespace, filter empty strings
    const words = trimmed.length === 0
      ? []
      : trimmed.split(/\s+/).filter(w => w.length > 0);

    this.wordCountSubject.next(words.length);
  }

  /** Reset both counters to zero */
  reset(): void {
    this.wordCountSubject.next(0);
    this.charCountSubject.next(0);
  }
}
