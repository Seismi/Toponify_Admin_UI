import { NgModule } from '@angular/core';

import { SpinnerComponent } from './spinner.component';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [MatProgressSpinnerModule],
    exports: [SpinnerComponent],
    declarations: [SpinnerComponent],
    providers: [],
})
export class SpinnerModule { }
