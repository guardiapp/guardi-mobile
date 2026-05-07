import { Pipe, PipeTransform } from '@angular/core';
import { parse, format } from '@formkit/tempo';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    try {
      // Parse the input time (e.g., "16:00:00")
      const parsedTime = parse(value, 'HH:mm:ss');

      // Format the time to 12-hour format with AM/PM
      return format(parsedTime, 'hh:mm a'); // e.g., "04:00 pm"
    } catch (error) {
      console.error('Invalid time format:', error);
      return value; // Return the original value if parsing fails
    }
  }
}
