import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
import { createHttpObservable } from './util';

@Injectable({ providedIn: 'root' })
export class Store {
  private subject: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  private coursesResponse$: Observable<Course[]> = createHttpObservable('/api/courses').pipe(
    map(jsObject => (jsObject?.payload ?? []).map((c: any) => c as Course))
  );

  private courses$: Observable<Course[]> = this.subject.asObservable();

  init: () => void = () => this.coursesResponse$.subscribe(
    (courses: Course[]) => this.subject.next(courses)
  );

  getCourses: () => Observable<Course[]> = () => this.courses$;

  saveCourse: (id: number, changes: any) => Observable<Response> = (id: number, changes: any) => {
    // Apply store pattern, i.e. take the existing state and replace it with the new modified state.
    const currentState: Course[] = this.subject.getValue();

    const changedCourseIndex = currentState.findIndex(c => c.id === id);
    const newUpdatedCourse: Course = { ...currentState[changedCourseIndex], ...changes };
    const stateCopy = currentState.slice(0);
    stateCopy[changedCourseIndex] = newUpdatedCourse;
    // Notify all subscribers of the change:
    this.subject.next(stateCopy);

    return fromPromise(fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  };

  getCourseById: (courseId: number) => Observable<Course> = (courseId: number) => this.courses$.pipe(
    map(courses => courses.find(c => c.id === courseId))
  );
}
