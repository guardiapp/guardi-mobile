import { Pipe, PipeTransform } from '@angular/core';
import { parse, format } from '@formkit/tempo';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    try {
      // Parse the input date (e.g., "2025-06-12 00:00:00" or "2025-06-12")
      const parsedDate = parse(value, 'YYYY-MM-DD HH:mm:ss') || parse(value, 'YYYY-MM-DD');

      // Format the date to display only the date part
      return format(parsedDate, 'YYYY-MM-DD'); // e.g., "2025-06-12"
    } catch (error) {
      console.error('Invalid date format:', error);
      // If parsing fails, try to extract just the date part manually
      const datePart = value.split(' ')[0];
      return datePart || value;
    }
  }
}
