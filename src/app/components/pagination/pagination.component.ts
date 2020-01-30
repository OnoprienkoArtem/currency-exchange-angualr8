import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() page: number;
  @Input() totalPages: number;

  @Output() goPrev = new EventEmitter<boolean>();
  @Output() goNext = new EventEmitter<boolean>();
  @Output() goPage = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  public onPage(page: number): void {
    this.goPage.emit(page);
  }

  public onPrev(): void {
    this.goPrev.emit(true);
  }

  public onNext(): void {
    this.goNext.emit(true);
  }

  public getPages(): number[] {
    const page = this.page || 1;
    const pagesToShow = 9;
    const pages: number[] = [];

    pages.push(page);

    for (let i = 0; i < pagesToShow - 1; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
        if (Math.max.apply(null, pages) < this.totalPages) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }

    pages.sort((a, b) => a - b);
    return pages;
  }
}
