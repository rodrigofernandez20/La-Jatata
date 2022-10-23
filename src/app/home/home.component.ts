import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { ReservaModalComponent } from '../reserva-modal/reserva-modal.component';
import {MediaMatcher} from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(private  dialog:  MatDialog, private  router:  Router,private observer: BreakpointObserver) { 
  }
  ngOnInit(): void {
    
  }
  showForm(){
    const ref =this.dialog.open(ReservaModalComponent)
  }
  


 

}
