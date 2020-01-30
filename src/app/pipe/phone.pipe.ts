import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any): any {
    if (!value) {
      return;
    }
    value = `+38-(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
    return value;
  }

}
