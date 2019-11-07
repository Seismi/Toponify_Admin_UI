import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as go from 'gojs';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import {WorkPackageDiagramService} from '@app/workpackage/services/workpackage-diagram.service';

const $ = go.GraphObject.make;

@Component({
  selector: 'smi-workpackage-tree-modal',
  templateUrl: './workpackage-tree-modal.component.html',
  styleUrls: ['./workpackage-tree-modal.component.scss'],
  providers: [WorkPackageDiagramService]
})

export class WorkPackageTreeModalComponent implements OnInit {
  diagram: go.Diagram;

  @ViewChild('workPackageTreeDiv')
  private diagramRef: ElementRef;

  constructor(
    public workPackageDiagramService: WorkPackageDiagramService,
    public dialogRef: MatDialogRef<WorkPackageTreeModalComponent>,
    // Workpackage data sent from workpackage.components.ts
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // // Place GoJS license key here:
    // // (go as any).licenseKey = '...'
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowSelect = false;
  }

  ngOnInit() {
    // Initialise diagram with
    this.diagram.div = this.diagramRef.nativeElement;
    this.diagram.nodeTemplate = this.workPackageDiagramService.getNodeTemplate();
    this.diagram.linkTemplate = this.workPackageDiagramService.getLinkTemplate();
    this.diagram.layout = this.workPackageDiagramService.getLayout();


    // Listener ensures that binding of "visible" property is evaluated after all nodes have been added to the diagram
    this.diagram.addDiagramListener(
      'InitialLayoutCompleted',
      function(event) {
        event.diagram.updateAllTargetBindings('');
      }
    );

    this.diagram.model = this.workPackageDiagramService.getModel(this.data.workpackages);
  }

  onClose() {
    this.dialogRef.close();
  }

}
