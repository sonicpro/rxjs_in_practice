import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import { fromEvent, Observable, Subscription, of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { Store } from '../common/store.service';

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
export class CourseDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    form: FormGroup;

    course: Course;

    private subscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        private store: Store,
        @Inject(MAT_DIALOG_DATA) course: Course ) {

        this.course = course;

        this.form = this.fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [course.releasedAt, Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {
      const saveClickObservable$: Observable<MouseEvent> = fromEvent(this.saveButton.nativeElement, 'click');
      const saveChangesObservable$ = saveClickObservable$.pipe(
        // Ignore MouseEvents from the source observable until the close() observable terminates.
        exhaustMap(() => {
          this.saveCourse(this.course.id, this.form.value);
          return this.close();
        })
      );
      this.subscription = saveChangesObservable$.subscribe(responseObserver);
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    close(): Observable<Response> {
      this.dialogRef.close();
      return of(new Response());
    }

    private saveCourse(id: number, changes: any): Observable<Response> {
      return this.store.saveCourse(id, changes);
    }
}
