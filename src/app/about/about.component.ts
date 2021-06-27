import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of, concat, interval } from 'rxjs';
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
    const source1$ = interval(1000);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);
    const result$ = concat(source1$, source2$, source3$);
    this.subscription = result$.subscribe(console.log);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
