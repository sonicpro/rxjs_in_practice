import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../model/course';
import { CoursesObservableService } from '../services/courses-observable.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  beginnerCourses: Course[];
  advancedCourses: Course[];

  private subscription: Subscription;

  constructor(private coursesObservableService: CoursesObservableService) {}

    ngOnInit() {
      const coursesArray$ = this.coursesObservableService.getCoursesObservable();
      this.subscription = coursesArray$.subscribe({
        next: (courses: Course[]) => {
          this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
          this.advancedCourses = courses.filter(course => course.category === 'ADVANCED');
        },
        complete: () => console.log('completed')
      });
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
}
