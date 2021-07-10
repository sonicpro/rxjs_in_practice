import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, pipe } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
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

  saveCourse: (id: number, changes: any) => Observable<Response> = (id: number, changes: any) => {
    // Apply store pattern, i.e. take the existing state and replace it with the new modified state.
    const currentState: Course[] = this.subject.getValue();

    const newUpdatedCourse: Course = { ...(currentState.filter(c => c.id === id)[0]), ...changes };
    // Notify all subscribers of the change:
    this.subject.next([ ...(currentState.filter(c => c.id !== id)), newUpdatedCourse ]);

    return fromPromise(fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  };
}
