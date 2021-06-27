import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as moment from 'moment';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  form: FormGroup;
  course: Course;

  private subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course) {

    this.course = course;

    this.form = this.fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {
    const autosaveObservable = this.form.valueChanges.pipe(
      filter(() => this.form.valid),
      concatMap(formValue => this.saveCourse(this.course.id, formValue))
    );

    this.subscription = autosaveObservable.subscribe({
      next: (response: Response) => response.json()
        .then(updatedCourse => console.log(updatedCourse))
        .catch(err => console.log(err)),
      error: (err: any) => console.log(err)
    });
  }

  ngAfterViewInit() {


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.dialogRef.close();
  }

  private saveCourse(id: number, changes: any): Observable<Response> {
    return fromPromise(fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
}
