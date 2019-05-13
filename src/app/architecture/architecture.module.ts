
import { CoreModule } from '@app/core/core.module';
import { NgModule } from '@angular/core';
import { ArchitectureRoutingModule } from './architecture-routing.module';
import { ArchitectureRoutingComponent } from './containers/architecture-routing.component';
import { ArchitectureComponent } from './containers/architecture.component';
import { NodeModule } from '@app/nodes/nodes.moudle';


@NgModule({
    imports: [
        CoreModule,
        NodeModule,
        ArchitectureRoutingModule
    ],
    exports: [],
    declarations: [ArchitectureRoutingComponent, ArchitectureComponent],
    providers: [],
})
export class ArchitectureModule { }
