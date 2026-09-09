import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSearchbar, IonSelect, IonSelectOption } from '@ionic/angular';

export interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, IonSearchbar, IonSelect, IonSelectOption],
  template: `
    <div class="search-filter-wrapper">
      <div class="search-input-box">
        <ion-searchbar
          [(ngModel)]="searchQuery"
          (ionInput)="onSearchChange()"
          [placeholder]="placeholder"
          debounce="300"
          animated="true">
        </ion-searchbar>
      </div>

      <div class="filter-box" *ngIf="filterOptions && filterOptions.length > 0">
        <ion-select
          [(ngModel)]="selectedFilter"
          (ionChange)="onFilterChange()"
          interface="popover"
          [placeholder]="filterPlaceholder">
          <ion-select-option value="">All</ion-select-option>
          <ion-select-option *ngFor="let opt of filterOptions" [value]="opt.value">
            {{ opt.label }}
          </ion-select-option>
        </ion-select>
      </div>
    </div>
  `,
  styles: [`
    .search-filter-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;

      @media (min-width: 640px) {
        flex-direction: row;
        align-items: center;
      }
    }

    .search-input-box {
      flex: 1;

      ion-searchbar {
        --background: var(--bixedu-surface, #ffffff);
        --border-radius: 10px;
        --box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        padding: 0;
      }
    }

    .filter-box {
      min-width: 160px;

      ion-select {
        --background: var(--bixedu-surface, #ffffff);
        --border-radius: 10px;
        --padding-start: 14px;
        --padding-end: 14px;
        border: 1px solid var(--bixedu-border, #e5e7eb);
        border-radius: 10px;
        min-height: 42px;
      }
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...';
  @Input() filterPlaceholder: string = 'Filter by';
  @Input() filterOptions: FilterOption[] = [];
  
  @Output() search = new EventEmitter<string>();
  @Output() filter = new EventEmitter<string>();

  searchQuery: string = '';
  selectedFilter: string = '';

  onSearchChange(): void {
    this.search.emit(this.searchQuery);
  }

  onFilterChange(): void {
    this.filter.emit(this.selectedFilter);
  }
}
