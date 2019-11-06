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

    /*
    let treePackages = [];

    treePackages = treePackages.filter(
      function(workPackage) {
        return (workPackage.status === 'merged' || workPackage.status === 'superseded')
          && workPackage.baseline.every(
            function(baseline) {
              return treePackages.some(
                function(workPackage2) {
                  return workPackage2.id !== baseline.id;
                });
            });
      }
    );*/

    this.diagram.model = this.workPackageDiagramService.getModel(this.data.workpackages);
  }

  onClose() {
    this.dialogRef.close();
  }

}
