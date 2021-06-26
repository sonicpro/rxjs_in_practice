import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../model/course';
import { CoursesObservableService } from '../services/courses-observable.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private coursesObservableService: CoursesObservableService) {}

  ngOnInit() {
    const coursesArray$ = this.coursesObservableService.getCoursesObservable();
    this.subscription = coursesArray$.subscribe({
      next: (courses: Course[]) => console.log(courses),
      complete: () => console.log('completed')
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
