import { AfterViewInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '@app/core/store';
import { getErrorMessage } from '@app/core/store/selectors/error.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(private snackBar: MatSnackBar, private store: Store<State>) {}

  ngAfterViewInit(): void {
    this.store.select(getErrorMessage).subscribe(msg => {
      if (msg) {
        this.snackBar.open(msg);
      } else {
        this.snackBar.dismiss();
      }
    });
  }
}
