import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import { Observable } from 'rxjs';
import {Lesson} from '../model/lesson';


@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        const courseId = this.route.snapshot.params['id'];



    }

    ngAfterViewInit() {




    }




}
