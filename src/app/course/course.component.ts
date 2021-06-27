import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { Observable, fromEvent, Subscription, concat } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';

const lessonsApiUrl = '/api/lessons?';
const courseApiUrl = '/api/courses/';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  private courseId: number;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    const url = `${courseApiUrl}${this.courseId}`;
    this.course$ = createHttpObservable(url);
  }

  ngAfterViewInit() {
    // Produces search term values as the user types in the search box.
    const searchResult$: Observable<Lesson[]> = fromEvent(this.input.nativeElement, 'input').pipe(
      map((e: InputEvent) => (e.target as HTMLInputElement).value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.produceNewHttpObservable(searchTerm))
    );

    // This observable executes once on AfterViewInit and terminates.
    const initialLessonList$: Observable<Lesson[]> = this.produceNewHttpObservable();

    this.lessons$ = concat(initialLessonList$, searchResult$);
  }

  private produceNewHttpObservable(searchTerm: string = ''): Observable<Lesson[]> {
    return createHttpObservable(`${lessonsApiUrl}courseId=${this.courseId}&filter=${searchTerm}`).pipe(
      map((o: any) => Object.values(o['payload']).map((l: unknown) => l as Lesson))
    );
  }
}
