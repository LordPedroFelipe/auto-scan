import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pascalCase'
})
export class PascalCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const palavras = value.trim().split(/[\s_-]+/);

    return palavras
      .map(palavra =>
        palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
      )
      .join('');
  }
}
