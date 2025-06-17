import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() total = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  mudarPagina(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.pageChange.emit(p);
    }
  }
}
