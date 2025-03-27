// kebab-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'npu',
})
export class Npu implements PipeTransform {
    transform(value: string | null): string | null {
        if (value) {
            let valueTranform = value.replace(/\D/g, '')
            let mascara = /^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/
            let result = valueTranform.replace(mascara, '$1-$2.$3.$4.$5.$6');
            return result;
        }
        return value;
    }
}