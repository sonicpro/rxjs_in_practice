import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';

const coursesApiUrl = 'api/courses';
const coursesResponseSubscriber = (observer: Observer<any>) => {
  // Using signal property of fetch API to cancel the ongoing HTTP request.
  const controller = new AbortController();
  const signal = controller.signal;

  fetch(coursesApiUrl, { signal })
    .then(response => response.json())
    .then(json => {
      observer.next(json);
      observer.complete();
    })
    .catch(err => {
      observer.error(err);
    });

    // Return the function. This function is executed from the client code via
    // unsubscribe() method called on the subscription.
    return () => controller.abort();
};

@Injectable({ providedIn: 'root' })
export class CoursesObservableService {
  getCoursesObservable = (): Observable<Course[]> => {
    const json$ = new Observable(coursesResponseSubscriber);
    return json$.pipe(
      map((o: any) => Object.values(o['payload']).map((c: unknown) => c as Course))
    );
  };
}
