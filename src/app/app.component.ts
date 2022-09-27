import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { queue } from 'rxjs';
import { QuantityModalComponent } from './quantity-modal/quantity-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
}
