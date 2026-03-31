import { Pipe, PipeTransform } from '@angular/core';

/**
 * RemoveSpecialCharsPipe
 * ----------------------
 * Strips all characters that are NOT:
 *   - letters (a-z, A-Z)
 *   - digits  (0-9)
 *   - whitespace
 *
 * Usage in template: {{ text | removeSpecialChars }}
 * Usage in component: this.pipe.transform(text)
 */
@Pipe({
  name: 'removeSpecialChars'
})
export class RemoveSpecialCharsPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Regex: keep only alphanumerics and whitespace
    return value.replace(/[^a-zA-Z0-9\s]/g, '');
  }
}
