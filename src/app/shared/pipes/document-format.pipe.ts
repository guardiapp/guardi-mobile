import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentFormat',
  standalone: true,
})
export class DocumentFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    // Convertir a string y eliminar cualquier punto existente
    const cleanNumber = value.toString().replace(/\./g, '');

    // Agregar puntos cada tres dígitos desde el final
    const formattedNumber = cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Agregar "C.I" al principio
    return `C.I ${formattedNumber}`;
  }
}
