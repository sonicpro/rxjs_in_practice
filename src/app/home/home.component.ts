import {Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
import { CoursesObservableService } from '../services/courses-observable.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private coursesObservableService: CoursesObservableService) {}

    ngOnInit() {
      const coursesArray$ = this.coursesObservableService.getCoursesObservable();
      this.beginnerCourses$ = coursesArray$.pipe(
        map(allCourses => allCourses.filter(c => c.category === 'BEGINNER'))
      );
      this.advancedCourses$ = coursesArray$.pipe(
        map(allCourses => allCourses.filter(c => c.category === 'ADVANCED'))
      );
    }
}
