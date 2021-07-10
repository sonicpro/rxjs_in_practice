import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import { Store } from '../common/store.service';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    /**
     * Injects the store service
     */
    constructor(private store: Store) {
    }

    ngOnInit() {

        this.store.init();

        this.beginnerCourses$ = this.store.getCourses()
            .pipe(
                map(courses => courses
                    .filter(course => course.category === 'BEGINNER'))
            );

        this.advancedCourses$ = this.store.getCourses()
            .pipe(
                map(courses => courses
                    .filter(course => course.category === 'ADVANCED'))
            );

    }

}
