import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';

const coursesApiUrl = 'api/courses';
const coursesResponseSubscriber = (observer: Observer<any>) => {
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

@Injectable({ providedIn: 'root' })
export class CoursesObservableService {
  getCoursesObservable = (): Observable<Course[]> => {
    const json$ = new Observable(coursesResponseSubscriber);
    return json$.pipe(
      map((o: any) => Object.values(o['payload']).map((c: unknown) => c as Course))
    );
  };
}
