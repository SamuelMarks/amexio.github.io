/**
 * Created by pratik on 2/1/18.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonDataService} from "../../services/data/common.data.service";
@Component({
  selector: 'data-grid-filter', template: `
    <input type="text" [(ngModel)]="filterValue" [attr.placeholder]="column.text" (keyup)="keyUpSearch(column)"
           type="{{column.datatype==='string' ? 'text' : 'number'}}" class="form-control"
           aria-label="Text input with dropdown button">
    <!--<i class="fa fa-filter" aria-hidden="true" (click)="showToolTip = !showToolTip"></i>-->
    <amexio-data-icon key="datagrid_filter" (click)="showToolTip = !showToolTip"></amexio-data-icon>
    <span *ngIf="showToolTip" class="dropdown" style="width: 250px;">
        <ul class="dropdown-list" *ngFor="let opt of filterOptions">
          <ng-container *ngIf="opt.type===column.datatype">
          <li class="list-items">
              <div (click)="selectedOption(column,opt)">
              {{opt.key}}&nbsp;<i [class]="opt.checkedStatus" aria-hidden="true"></i>
            </div>
          </li>
          </ng-container>
         </ul>
      </span>
  `
})

export class DataGridFilterComponent implements OnInit {
  @Input() column: any;

  @Output() filterObject: any = new EventEmitter<any>();

  filterValue: any;

  filterOptions: any;

  elementId: any;

  showToolTip: boolean;

  constructor(private dataTableService: CommonDataService) {

    this.filterOptions = [{
      'key': 'Is Equal To', 'value': '==', 'type': 'string', 'checkedStatus': ''
    }, {
      'key': 'Is Not Equal To', 'value': '!=', 'type': 'string', 'checkedStatus': ''
    }, {
      'key': 'Start With', 'value': '1', 'type': 'string', 'checkedStatus': 'fa fa-check'
    },

      {
        'key': 'Ends With', 'value': '2', 'type': 'string', 'checkedStatus': ''
      }, {
        'key': 'Contains', 'value': '3', 'type': 'string', 'checkedStatus': ''
      }, {
        'key': 'Is Equal To', 'value': '==', 'type': 'number', 'checkedStatus': ''
      }, {
        'key': 'Is Not Equal To', 'value': '!=', 'type': 'number', 'checkedStatus': ''
      }, {
        'key': 'Is greater Than', 'value': '<', 'type': 'number', 'checkedStatus': ''
      }, {
        'key': 'Is less Than', 'value': '>', 'type': 'number', 'checkedStatus': ''
      },

      {
        'key': 'Is less Than or equal to', 'value': '>=', 'type': 'number', 'checkedStatus': ''
      }, {
        'key': 'Is greater Than or equal to', 'value': '=<', 'type': 'number', 'checkedStatus': 'fa fa-check'
      }];
  }

  ngOnInit() {
  }

  selectedOption(col: any, opt: any) {
    this.checkStatus();
    let filter: any = {};
    opt.checkedStatus = 'fa fa-check';
    filter['key'] = col.dataindex;
    filter['value'] = this.filterValue;
    filter['filter'] = opt.value;
    filter['type'] = col.datatype;
    if (this.filterValue) {
      col.filterIcon = true;
      this.filterDataObject(filter, col);
    }
    this.showToolTip = false;
  }

  keyUpSearch(col: any) {
    this.showToolTip = false;
    if (this.filterValue == null || this.filterValue === '') {
      this.removeFilter(col);
    } else {
      col.filterIcon = true;
      const filter: any = {};
      filter['key'] = col.dataindex;
      filter['value'] = this.filterValue;
      filter['type'] = col.datatype;
      this.filterOptions.forEach((opt: any) => {
        if (opt.checkedStatus === 'fa fa-check') {
          if (col.datatype === opt.type) {
            filter['filter'] = opt.value;
          }
        }
      });
      this.filterDataObject(filter, col);
    }
  }

  removeFilter(column: any) {
    this.filterValue = '';
    column.filterIcon = false;
    // $('#' + column.dataindex).val('');
    this.dataTableService.filteredObject.forEach((option: any, index: any) => {
      if (option.key === column.dataindex) {
        this.dataTableService.filteredObject.splice(index, 1);
      }
    });
    this.filterObject.emit(this.dataTableService.filteredObject);
  }

  checkStatus() {
    this.filterOptions.forEach((opt: any) => {
      opt.checkedStatus = '';
    });
  }

  filterDataObject(filter: any, col: any) {
    this.dataTableService.filteredObject.forEach((option: any, index: any) => {
      if (option.key == col.dataindex) {
        this.dataTableService.filteredObject.splice(index, 1);
      }
    });
    this.dataTableService.filteredObject.push(filter);
    this.filterObject.emit(this.dataTableService.filteredObject);
  }
}
