import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { Store } from '../common/store.service';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  courseId: number;

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute, private store: Store) {


  }

  ngOnInit() {

    this.courseId = parseInt(this.route.snapshot.params['id'], 10);

    this.course$ = this.store.getCourseById(this.courseId);

  }

  ngAfterViewInit() {

    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res['payload'])
      );
  }


}











