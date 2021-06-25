import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private coursesService: CoursesService) { }

  ngOnInit() {
    const courses$ = this.coursesService.getCourses();
    this.subscription = this.coursesService.getCourses().subscribe(
      (_) => {});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
