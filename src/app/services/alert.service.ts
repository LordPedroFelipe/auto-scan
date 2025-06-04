import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.show(message, 'success-snackbar');
  }

  showError(message: string): void {
    this.show(message, 'error-snackbar');
  }

  showInfo(message: string): void {
    this.show(message, 'info-snackbar');
  }

  showWarning(message: string): void {
    this.show(message, 'warning-snackbar');
  }

  private show(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
