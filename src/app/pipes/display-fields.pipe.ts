import { Pipe, PipeTransform } from '@angular/core';
import { fmtDisplaySetField, SetField } from '../types/workout';

@Pipe({
  name: 'displayFields',
})
export class DisplayFieldsPipe implements PipeTransform {
  transform(value: SetField[]): string {
    return value.map((v) => fmtDisplaySetField(v)).join(', ');
  }
}

@Pipe({
  name: 'displayField',
})
export class DisplayFieldPipe implements PipeTransform {
  transform(value: SetField): string {
    return fmtDisplaySetField(value);
  }
}
