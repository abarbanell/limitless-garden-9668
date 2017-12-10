import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { HomeComponent } from '../home/home.component';
import { CollectionsComponent } from './collections.component';

import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { routing } from '../app.routing';
import { DataComponent } from '../data/data.component';

describe('CollectionsComponent', () => {
  let component: CollectionsComponent;
  let fixture: ComponentFixture<CollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HomeComponent,
        CollectionsComponent,
        DataComponent 
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/' },        
        AuthService,
        DataService
      ],
      imports: [
        HttpClientTestingModule,
        routing
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial data', () => {
    expect(component.data).toBeDefined();
    expect(component.data.count).toBeGreaterThanOrEqual(component.data.rows.length);
  })
});
