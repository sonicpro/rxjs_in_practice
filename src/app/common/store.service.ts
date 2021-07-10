import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, pipe } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Course } from '../model/course';
import { createHttpObservable } from './util';

@Injectable({ providedIn: 'root' })
export class Store {
  private subject: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  private coursesResponse$: Observable<Course[]> = createHttpObservable('/api/courses').pipe(
    map(jsObject => (jsObject?.payload ?? []).map((c: any) => c as Course)),
    shareReplay()
  );

  private courses$: Observable<Course[]> = this.subject.asObservable();

  init: () => void = () => this.coursesResponse$.subscribe(
    (courses: Course[]) => this.subject.next(courses)
  );

  getCourses: () => Observable<Course[]> = () => this.courses$;
}
