import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euro',
  standalone: true
})
export class EuroPipe implements PipeTransform {

  transform(value: number | undefined, ...args: unknown[]): unknown {
    if (value == null) return 
    return value.toFixed(2) + "€" ;
  }

}
