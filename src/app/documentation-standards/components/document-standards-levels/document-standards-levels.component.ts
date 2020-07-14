import { AfterViewInit, Component, Injectable, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';

export class Node {
  children: Node[];
  item: string;
}

export class FlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

const Levels = {
  'Work Packages': null,
  'Systems - All': {
    'System - Transactional': null,
    'System - Analytical': null,
    'System - Reporting': null,
    'System - MasterData': null,
    'System - Files': null
  },
  'Data - All': {
    'Data - Data Structure': null,
    'Data - Data Set': null,
    'Data - Master Data Set': null
  },
  'Dimensions - All': null,
  'Reporting Concepts - All': {
    'Reporting Concepts - Structures': null,
    'Reporting Concepts - Lists': null,
    'Reporting Concepts - Key': null
  },
  'Links - All': {
    'System Links - All': {
      'System Links - MasterData': null,
      'System Links - Data': null
    },
    'Data Links - All': {
      'Data Links - Master Data': null,
      'Data Links - Data': null
    },
    'Dimension Links': null,
    'Reporting Concept Links': null
  },
  'Reports - All': null,
  Attributes: null,
  Rules: null,
  RADIO: null
};

@Injectable()
export class ChecklistDatabase {
  public dataChange = new BehaviorSubject<Node[]>([]);
  get data(): Node[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(Levels, 0);
    this.dataChange.next(data);
  }

  buildFileTree(obj: { [key: string]: any }, level: number): Node[] {
    return Object.keys(obj).reduce<Node[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Node();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'smi-document-standards-levels',
  templateUrl: 'document-standards-levels.component.html',
  styleUrls: ['document-standards-levels.component.scss'],
  providers: [ChecklistDatabase]
})
export class DocumentStandardsLevelsComponent implements AfterViewInit, OnChanges {
  @ViewChild('tree') tree;
  @Input() control: FormControl;
  @Input() isDisabled = true;
  @Input() modalMode = false;
  private flatNodeMap = new Map<string, FlatNode>();
  private nestedNodeMap = new Map<Node, FlatNode>();
  public treeControl: FlatTreeControl<FlatNode>;
  private treeFlattener: MatTreeFlattener<Node, FlatNode>;
  public dataSource: MatTreeFlatDataSource<Node, FlatNode>;
  private checklistSelection = new SelectionModel<FlatNode>(true /* multiple */);

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.tree.treeControl.collapseAll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.control) {
      this._database.initialize();
      const selectedFlatNodes = this.control.value ? this.control.value.map(item => this.flatNodeMap.get(item)) : [];
      this.checklistSelection = new SelectionModel<FlatNode>(true, selectedFlatNodes);
    }
  }

  getLevel = (node: FlatNode) => node.level;
  isExpandable = (node: FlatNode) => node.expandable;
  getChildren = (node: Node): Node[] => node.children;
  hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: FlatNode) => _nodeData.item === '';

  transformer = (node: Node, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item ? existingNode : new FlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(node.item, flatNode);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
    // tslint:disable-next-line
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /* Select/deselect all the descendants node */
  levelItemSelectionToggle($event, node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.every(child => this.checklistSelection.isSelected(child));
    this.control.setValue(this.checklistSelection.selected.map(selectedNode => selectedNode.item));
  }

  levelSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.control.setValue(this.checklistSelection.selected.map(selectedNode => selectedNode.item));
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /* Select all levels */
  checkAll(event) {
    if (event.checked) {
      this.flatNodeMap.forEach(node => {
        this.checklistSelection.select(node);
      });
    } else {
      this.flatNodeMap.forEach(node => {
        this.checklistSelection.deselect(node);
      });
    }
    this.control.setValue(this.checklistSelection.selected.map(node => node.item));
  }

  isEveryNodeSelected(): boolean {
    let selected = 0;
    this.flatNodeMap.forEach(node => {
      if (this.checklistSelection.isSelected(node)) {
        selected++;
      }
    });
    if (selected === this.flatNodeMap.size) {
      return true;
    }
    return false;
  }
}
