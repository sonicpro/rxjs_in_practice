import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observer, Subscription, Observable } from 'rxjs';

const coursesApiUrl = 'api/courses';
const coursesResponseSubscriber = (observer: Observer<string>) => {
  fetch(coursesApiUrl)
    .then(response => response.json())
    .then(json => {
      observer.next(json);
      observer.complete();
    })
    .catch(err => {
      observer.error(err);
    });
};

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  ngOnInit() {
    const courses$ = new Observable(coursesResponseSubscriber);
    this.subscription = courses$.subscribe({
      next: (courses: string) => console.log(courses),
      complete: () => console.log('completed')
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
