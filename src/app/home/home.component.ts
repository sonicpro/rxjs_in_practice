import {Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, shareReplay, retryWhen, delayWhen, tap } from 'rxjs/operators';
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
      const coursesArray$ = this.coursesObservableService.getCoursesObservable().pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        retryWhen(errors => errors.pipe(
          tap({ next: () => console.log('error occurred. Retrying in 1 second...') }),
          delayWhen((courses: Course[]) => timer(1000))
        ))
      );
      this.beginnerCourses$ = coursesArray$.pipe(
        map(allCourses => allCourses.filter(c => c.category === 'BEGINNER'))
      );
      this.advancedCourses$ = coursesArray$.pipe(
        map(allCourses => allCourses.filter(c => c.category === 'ADVANCED'))
      );
    }
}
