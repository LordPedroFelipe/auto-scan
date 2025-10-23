import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'linkify', pure: true })
export class LinkifyPipe implements PipeTransform {
  private urlRegex = /(https?:\/\/[^\s]+)/g;

  transform(text?: string): string {
    if (!text) return '';
    const withLinks = text.replace(this.urlRegex, (url) => {
      const esc = url.replace(/"/g, '&quot;');
      return `<a href="${esc}" target="_blank" rel="noopener noreferrer">${esc}</a>`;
    });
    return withLinks.replace(/\n/g, '<br>');
  }
}
