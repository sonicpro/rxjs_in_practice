import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Course } from '../model/course';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private apiUrl = 'api/courses';

  constructor(
    private http: HttpClient
  ) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
}
