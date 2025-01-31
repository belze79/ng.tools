import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padstart2'
})
export class Padstart2Pipe implements PipeTransform {

  transform(value: number): string {
    return value.toString().padStart(2, '0')
  }

}
