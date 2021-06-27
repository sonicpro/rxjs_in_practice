import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of, concat, interval } from 'rxjs';
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
    const http$ = this.coursesObservableService.getCoursesObservable();
    this.subscription = http$.subscribe(console.log);
    setTimeout(() => {
      this.subscription.unsubscribe();
    }, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
