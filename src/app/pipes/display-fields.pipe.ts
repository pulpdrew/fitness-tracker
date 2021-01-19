import { Pipe, PipeTransform } from '@angular/core';
import { fmtDisplaySetField, SetField } from '../types/exercise-set';

@Pipe({
  name: 'displayFields',
})
export class DisplayFieldsPipe implements PipeTransform {
  transform(value: SetField[]): string {
    return value.map((v) => fmtDisplaySetField(v)).join(', ') || 'None';
  }
}

@Pipe({
  name: 'displayField',
})
export class DisplayFieldPipe implements PipeTransform {
  transform(value: string): string {
    return fmtDisplaySetField(value as SetField);
  }
}
