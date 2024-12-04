import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseConverter',
  standalone: true
})
export class UppercaseConverterPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.toUpperCase();
  }

}
