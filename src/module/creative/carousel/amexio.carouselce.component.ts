/*
* Copyright [2019] [Metamagic]
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*  Created by kedar on 18/4/2019.
*/
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild,
} from '@angular/core';
import { AmexioTemplateDirective } from '../../panes/amexio.pane.module';
import { CommonDataService } from '../../services/data/common.data.service';
import { TitleModel } from '../carousel/amexio.carouselce.model';
@Component({
  selector: 'amexio-carousel-ce',
  templateUrl: './amexio.carouselce.component.html',
  animations: [
    trigger(
      'move',
      [
        transition(
          ':enter', [
            style({ opacity: 0 }),
            animate('2s', style({ opacity: 1 })),
          ],
        ),
        transition(
          ':leave', [
            style({ opacity: 1 }),
            animate('2s', style({ opacity: 0 })),
          ],
        ),
      ],
    )],
})
export class AmexioCarouselCEComponent implements OnInit, AfterContentInit {
  /*
Properties
name : data
datatype : any
version : 5.10 onwards
default : none
description : Local Data binding.
*/
  @Input() data: any[];
  /*
  Properties
  name : http-url
  datatype : string
  version : 5.10 onwards
  default : none
  description : REST url for fetching data.
  */
  @Input('http-url') httpurl: string;

  /*
  Properties
  name : data-reader
  datatype : string
  version : 5.10 onwards
  default : none
  description : Key in JSON Datasource for records.
  */
  @Input('data-reader') datareader: string;

  /*
  Properties
  name : http-method
  datatype : string
  version : 5.10 onwards
  default : none
  description : Type of HTTP call, POST,GET etc.
  */
  @Input('http-method') httpmethod: string;

  responseData: any;
  currentImageIndex = 0;
  imageData: any;
  centerImagePath: string;
  nextImagePath: string;
  preImagePath: string;

  previousTitle: any;
  centerTitle: any;
  nextTitle: any;
  positionLeft: any;
  positionRight: any;
  @Input('template-width') templateWidth: any;

  @Input('position') position: any;

  public itemTemplate: TemplateRef<any>;

  @ContentChildren(AmexioTemplateDirective) templates: QueryList<any>;

  @ViewChild('tab', { read: ElementRef }) public tabs: ElementRef;

  itemData: any;

  currentObj: any;

  titleModel: TitleModel;

  constructor(public http: HttpClient, private dataService: CommonDataService) {
    this.titleModel = new TitleModel();
  }

  ngOnInit() {
    if (this.httpmethod && this.httpurl) {
      this.dataService.fetchData(this.httpurl, this.httpmethod).subscribe((response) => {
        this.responseData = response;
      }, (error) => {
      }, () => {
        this.setData(this.responseData);
      });
    } else if (this.data) {
      this.setData(this.data);
    }
    this.positionCalculation();
  }

  ngAfterContentInit() {
    this.templates.forEach((item: any) => {
      this.itemTemplate = item.template;
    });
  }
  positionCalculation() {

    if (this.templateWidth) {
      if (this.position === 'left') {
        this.positionRight = (100 - this.templateWidth);
        this.positionLeft = 0;
      } else if (this.position === 'right') {
        this.positionRight = 0;
        this.positionLeft = (100 - this.templateWidth);
      } else if (this.position === 'center') {
        this.positionLeft = ((100 - this.templateWidth) / 2);
        this.positionRight = this.positionLeft;
      }
    } else {
      if (this.position === 'left') {
        this.positionRight = 60;
        this.positionLeft = 0;
      } else if (this.position === 'right') {
        this.positionRight = 0;
        this.positionLeft = 60;
      } else if (this.position === 'center') {
        this.positionLeft = 30;
        this.positionRight = 30;
      }
    }
  }

  setData(httpResponse: any) {
    let responsedata = httpResponse;
    // Check if key is added?
    if (this.datareader != null) {
      const dr = this.datareader.split('.');
      for (const ir of dr) {
        responsedata = responsedata[ir];
      }
    } else {
      responsedata = httpResponse;
    }
    this.imageData = responsedata;
    this.titleModel.previousTitle = this.imageData[this.imageData.length - 1].title ? this.imageData[this.imageData.length - 1].title : '';
    this.titleModel.centerTitle = this.imageData[0].title ? this.imageData[0].title : '';
    this.titleModel.nextTitle = this.imageData[1].title ? this.imageData[1].title : '';
  }

  dividedPreviousMethod() {
    this.imageData.forEach((element: any, index: any) => {
      if (element && element.active) {
        this.currentImageIndex = index;
      }
    });
  }
  previousClick() {
    this.dividedPreviousMethod();
    if (this.currentImageIndex === 0) {
      this.previousClickMethod();
    } else {
      this.imageData.forEach((element: any, index: any) => {
        if (index === this.currentImageIndex - 1) {
          const duplicateIndex = this.currentImageIndex - 1;
          this.imageData[duplicateIndex].active = true;
          if (this.imageData[duplicateIndex] && this.imageData[duplicateIndex - 1] &&
            this.imageData[duplicateIndex].title && this.imageData[duplicateIndex + 1].title) {
            this.titleModel.setTitle(this.imageData[duplicateIndex - 1].title,
              this.imageData[duplicateIndex].title, this.imageData[duplicateIndex + 1].title);
          } else {
            this.titleModel.setTitle(this.imageData[this.imageData.length - 1].title,
              this.imageData[0].title, this.imageData[this.currentImageIndex].title);
          }
        } else {
          this.imageData[index].active = false;
        }
      });
    }
  }

  previousClickMethod() {
    this.imageData[this.currentImageIndex].active = true;
    const lastIndex = this.imageData.length - 1;
    this.currentImageIndex = this.imageData.length - 1;
    this.imageData.forEach((element: any, index: any) => {
      if (index === this.currentImageIndex) {
        this.imageData[index].active = true;
        if (this.imageData[lastIndex] && this.imageData[lastIndex].title) {
          this.titleModel.setTitle(this.imageData[lastIndex - 1].title,
            this.imageData[lastIndex].title, this.imageData[0].title);
        }
      } else {
        this.imageData[index]['active'] = false;
      }
    });
  }
  onPreBtnHover(i: number) {
    if (i === 0) {
      this.preImagePath = this.imageData[this.imageData.length - 1].imagepath;
    } else {
      const ind = i - 1;
      this.preImagePath = this.imageData[ind].imagepath;
    }
  }

  onNextBtnHover(i: number) {

    if (i === 0) {
      const ind = i + 1;
      this.nextImagePath = this.imageData[ind].imagepath;
    } else {
      const ind = i + 1;
      if (ind === this.imageData.length) {
        this.nextImagePath = this.imageData[0].imagepath;
      } else {
        this.nextImagePath = this.imageData[ind].imagepath;
      }
    }
  }

  nextClick() {
    this.dividedPreviousMethod();
    if (this.currentImageIndex === 0) {
      this.currentImageIndex = 1;
      this.imageData[this.currentImageIndex].active = true;
      const nextIndex = this.currentImageIndex;
      if (this.imageData[nextIndex] && this.imageData[nextIndex].title) {
        this.titleModel.setTitle(this.imageData[nextIndex - 1].title, this.imageData[nextIndex].title,
          this.imageData[nextIndex + 1].title);
      }
      this.setFlag();
    } else {
      if (this.currentImageIndex === this.imageData.length - 1) {
        this.currentImageIndex = 0;
        this.titleModel.setTitle(this.imageData[this.imageData.length - 1].title,
          this.imageData[this.currentImageIndex].title, this.imageData[this.currentImageIndex + 1].title);
      } else {
        this.currentImageIndex++;
        const nextIndex = this.currentImageIndex;
        if (this.currentImageIndex < this.imageData.length - 1) {
          this.titleModel.setTitle(this.imageData[nextIndex - 1].title,
            this.imageData[nextIndex].title, this.imageData[nextIndex + 1].title);
        } else {
          this.titleModel.setTitle(this.imageData[nextIndex - 1].title,
            this.imageData[nextIndex].title, this.imageData[0].title);
        }
      }
      this.setFlag();
    }
  }

  setFlag() {
    this.imageData.forEach((element: any, index: any) => {
      if (index === this.currentImageIndex) {
        this.imageData[index].active = true;
      } else {
        this.imageData[index]['active'] = false;
      }
    });
  }
}
