import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  public isComandaBeingCalled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
}
