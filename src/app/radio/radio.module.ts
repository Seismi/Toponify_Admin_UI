import { NgModule } from '@angular/core';
import { RadioComponent } from './containers/radio.component';
import { RadioRoutingComponent } from './containers/radio-routing.components';
import { CoreModule } from '@app/core/core.module';
import { CommonModule } from '@angular/common';
import { RadioRoutingModule } from './radio-routing.module';

@NgModule({
    imports: [
        RadioRoutingModule,
        CoreModule,
        CommonModule
    ],
    exports: [],
    declarations: [RadioComponent, RadioRoutingComponent],
    providers: [],
})
export class RadioModule { }
