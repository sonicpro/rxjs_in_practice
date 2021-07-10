import { Observer, Observable } from 'rxjs';

const getResponseJsonSubscriber: (url: string) => (observer: Observer<any>) => () => void =
(url: string) =>
  (observer: Observer<Response>) => {
    // Using signal property of fetch API to cancel the ongoing HTTP request.
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then(response => response.json())
      .then(json => {
        observer.next(json);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      });

    // Return the function. This function is executed from the client code via
    // unsubscribe() method called on the subscription.
    return () => controller.abort();
  };

export const createHttpObservable: (url: string) => Observable<any> = (url: string) =>
  new Observable(getResponseJsonSubscriber(url));

