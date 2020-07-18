import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseEntityModel} from "../../model/base-entity.model";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  _entities: BaseEntityModel[];
  visibleEntities: BaseEntityModel[];
  @Output() visibleEntitiesChanged = new EventEmitter<BaseEntityModel[]>();
  @Input() entityName: string = "Entities";

  activePage: number = 0;
  pageSize: number = 5;
  numberOfPages: number;
  pages: number[];
  constructor() { }

  ngOnInit() {
  }

  updateEntitiesAndPages() {
    this.numberOfPages = Math.ceil(this.entities.length / this.pageSize);
    this.pages = Array.from(Array(this.numberOfPages),(x, i) => i);
  }

  @Input()
  set entities(value: BaseEntityModel[]) {
    this._entities = value;
    this.updateEntitiesAndPages();
    this.changePage(this.activePage);
  }

  get entities(): BaseEntityModel[] {
    return this._entities;
  }

  changePage(page: number) {
    this.activePage = page;
    let updatePage = true;

    if (this.activePage < 0) {
      this.activePage = 0;
      updatePage = false;
    } else if (this.activePage === this.numberOfPages) {
      this.activePage = this.numberOfPages - 1;
      updatePage = false;
    }

    if (updatePage && this.pageSize < this.entities.length) {
      const firstEntityIndex = this.pageSize * this.activePage;
      const lastEntityIndex = (firstEntityIndex + this.pageSize) >= this.entities.length ?
        this.entities.length: firstEntityIndex + this.pageSize;

      this.visibleEntities = this.entities.slice(this.pageSize * this.activePage, lastEntityIndex);
    } else {
      this.visibleEntities = this.entities.slice();
    }

    this.visibleEntitiesChanged.emit(this.visibleEntities);
  }

  updatePageSize(size: number) {
    this.pageSize = size;
    this.changePage(0);
  }
}
