import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { concatMap, filter, exhaustMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as moment from 'moment';

const responseObserver = {
  next: (response: Response) => response.json()
    .then(updatedCourse => console.log(updatedCourse))
    .catch(err => console.log(err)),
  error: (err: any) => console.log(err)
};

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
  private autoSaveSubscription: Subscription;

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

    // this.saveCourse() returns the saved course data in <Observable> Response.
    // Log it to console using the next() method of "responseObserver".
    this.autoSaveSubscription = autosaveObservable.subscribe(responseObserver);
  }

  ngAfterViewInit() {
    const saveClickObservable$: Observable<MouseEvent> = fromEvent(this.saveButton.nativeElement, 'click');
    const saveChangesObservable$ = saveClickObservable$.pipe(
      // Ignore MouseEvents from the source observable until the saveCourse() observable terminates.
      exhaustMap(() => this.saveCourse(this.course.id, this.form.value))
    );
    this.subscription = saveChangesObservable$.subscribe(responseObserver);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.autoSaveSubscription.unsubscribe();
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
