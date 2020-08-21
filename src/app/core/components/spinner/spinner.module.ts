import { NgModule } from '@angular/core';

import { SpinnerComponent } from './spinner.component';
import { MatProgressSpinnerModule, MatButtonModule } from '@angular/material';

@NgModule({
    imports: [MatProgressSpinnerModule, MatButtonModule],
    exports: [SpinnerComponent],
    declarations: [SpinnerComponent],
    providers: [],
})
export class SpinnerModule { }
