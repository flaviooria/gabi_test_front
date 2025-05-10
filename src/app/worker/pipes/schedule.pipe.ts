import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'schedule',
  standalone: false
})
export class SchedulePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
