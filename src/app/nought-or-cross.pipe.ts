import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'noughtOrCross'
})
export class NoughtOrCrossPipe implements PipeTransform {

    transform(value: number): string {
        return value === 0 ? '⭕':'❌️';
    }
}
