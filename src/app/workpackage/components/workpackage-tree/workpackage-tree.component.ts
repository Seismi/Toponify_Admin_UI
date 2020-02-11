import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import * as go from 'gojs';
import { WorkPackageDiagramService } from '@app/workpackage/services/workpackage-diagram.service';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { Observable } from 'rxjs';

const $ = go.GraphObject.make;

@Component({
  selector: 'smi-workpackage-tree',
  templateUrl: './workpackage-tree.component.html',
  styleUrls: ['./workpackage-tree.component.scss'],
  providers: [WorkPackageDiagramService]
})
export class WorkPackageTreeComponent implements OnInit, OnChanges {
  public diagram: go.Diagram;

  @Input() workpackages$: Observable<WorkPackageEntity[]>;
  @Output() selectWorkpackage = new EventEmitter<WorkPackageDetail>();
  @Input() checked: boolean;

  @ViewChild('workPackageTreeDiv') private diagramRef: ElementRef;

  constructor(public workPackageDiagramService: WorkPackageDiagramService) {
    (go as any).licenseKey =
      '2bf843eab76358c511d35a25403e7efb0ef72d35cf834da2590517a3ed5d604123cce17155d28d94c0e848fd4a28c1dc8e973d7d9' +
      '54e013fee39d6df4bea82abb53471b712584587f7012390cead29a5ff2a79f297b473f1c8688aa7bbaec3ce0ce9e1c44bcb0eb33678062e567e';
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowSelect = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.checked) {
      this.diagram.model = this.workPackageDiagramService.getModel(this.workpackages$);
    }
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    this.diagram.nodeTemplate = this.workPackageDiagramService.getNodeTemplate();
    this.diagram.linkTemplate = this.workPackageDiagramService.getLinkTemplate();
    this.diagram.layout = this.workPackageDiagramService.getLayout();
    this.diagram.model = this.workPackageDiagramService.getModel(this.workpackages$);

    this.diagram.addDiagramListener('ChangedSelection', ev => {
      const parts = ev.diagram.selection.toArray();
      this.selectWorkpackage.emit(parts.length === 1 ? parts[0].data : null);
    });
  }
}
