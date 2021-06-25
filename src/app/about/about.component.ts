import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('imageElement')
  image: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    const mouseObservable = fromEvent(this.image.nativeElement, 'click');
    mouseObservable.pipe(
      tap(() => setTimeout(() => {
        let counter = 0;
        setInterval(() => {
          console.log(counter);
          counter++;
        }, 1000);
      }, 3000))
    );
  }
}
