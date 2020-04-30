import { Component, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants';
import { User } from '@app/settings/store/models/user.model';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { Tag, NodeDetail } from '@app/architecture/store/models/node.model';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { radioCategories } from '../../store/models/radio.model';

interface Scores {
  level: number;
  text: string;
}

enum TrafficLightColour {
  red = '#CC3232',
  yellow = '#e7b416',
  green = '#2dc937'
}

@Component({
  selector: 'smi-radio-detail',
  templateUrl: './radio-detail.component.html',
  styleUrls: ['./radio-detail.component.scss']
})
export class RadioDetailComponent implements DoCheck {
  public users: User[];
  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() modalMode = false;
  @Input() radioStatus: string;
  @Input() rows = 8;
  @Input() tags: Tag[];
  @Input() availableTags: Tag[];
  @Input() selectedNode: NodeDetail;
  @Input() workpackages: WorkPackageEntity[];
  @Input() radioCategory: string;
  @Input() disabled: boolean;
  @Input() editModal = false;
  public selectedOptions = [];
  public severityTooltip: string;
  public frequencyTooltip: string;

  @Input()
  set data(data: any[]) {
    this.users = data;
  }

  public scores: Scores[] = [
    {
      level: 1,
      text: 'Lowest'
    },
    {
      level: 2,
      text: 'Low'
    },
    {
      level: 3,
      text: 'Medium'
    },
    {
      level: 4,
      text: 'High'
    },
    {
      level: 5,
      text: 'Highest'
    }
  ];
  public categories = Constants.RADIO_CATEGORIES;
  public status = Constants.RADIO_STATUS;
  public editor = InlineEditor;
  public config = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'insertTable',
      'undo',
      'redo'
    ],
    removePlugins: ['MediaEmbed', 'ImageUpload', 'ImageToolbar', 'ImageStyle', 'ImageCaption', 'Image', 'EasyImage']
  };

  @Output() archiveRadio = new EventEmitter<void>();
  @Output() saveRadio = new EventEmitter<void>();
  @Output() deleteRadio = new EventEmitter<void>();
  @Output() addTag = new EventEmitter<string>();
  @Output() updateAvailableTags = new EventEmitter<void>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Output() selectWorkPackage = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  ngDoCheck(): void {
    this.radioCategory = this.group.value.category;
  }

  compareUsers(u1: any, u2: any): boolean {
    return u1.name === u2.name && u1.id === u2.id;
  }

  onArchive() {
    this.archiveRadio.emit();
  }

  onSave() {
    this.isEditable = false;
    this.saveRadio.emit();
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }

  onDelete(): void {
    this.deleteRadio.emit();
  }

  getSeverityLabel(): string {
    switch (this.radioCategory) {
      case radioCategories.risk:
        return 'Severity';
      case radioCategories.opportunity:
        return 'Potential';
      case radioCategories.assumption:
      case radioCategories.dependency:
      case radioCategories.issue:
        return 'Impact';
    }
  }

  getSeverityTooltip(): string {
    switch (this.radioCategory) {
      case radioCategories.risk:
        return this.severityTooltip = 'Severity of the risk';
      case radioCategories.assumption:
        return this.severityTooltip = 'Impact of the assumption if it is revealed to be incorrect';
      case radioCategories.dependency:
        return this.severityTooltip = 'Impact of the dependency if it is not met';
      case radioCategories.issue:
        return this.severityTooltip = 'Impact of the issue';
      case radioCategories.opportunity:
        return this.severityTooltip = 'Potential of the opportunity';
    }
  }

  getFrequencyLabel(): string {
    switch (this.radioCategory) {
      case radioCategories.risk:
        return 'Probability';
      case radioCategories.assumption:
      case radioCategories.dependency:
        return 'Improbability';
      case radioCategories.issue:
      case radioCategories.opportunity:
        return 'Frequency';
    }
  }

  getFrequencyTooltip(): string {
    switch (this.radioCategory) {
      case radioCategories.risk:
        return this.frequencyTooltip = 'Probability of the risk';
      case radioCategories.assumption:
        return this.frequencyTooltip = 'Probability that the assumption is incorrect';
      case radioCategories.dependency:
        return this.frequencyTooltip = 'Probability that the dependency is not met';
      case radioCategories.issue:
        return this.frequencyTooltip = 'Frequency at which the issue occurs';
      case radioCategories.opportunity:
        return this.frequencyTooltip = 'Frequency of the opportunity';
    }
  }

  getSliderValue(sliderValue: number): string {
    switch (sliderValue) {
      case 1:
        return 'Very Low';
      case 2:
        return 'Low';
      case 3:
        return 'Medium';
      case 4:
        return 'High';
      case 5:
        return 'Very High';
    }
  }

  getChipColour(sliderValue: number): string {
    switch (sliderValue) {
      case 1:
      case 2:
        return TrafficLightColour.green;
      case 3:
        return TrafficLightColour.yellow;
      case 4:
      case 5:
        return TrafficLightColour.red;
    }
  }

  getMitigationLabel(): string {
    switch (this.radioCategory) {
      case radioCategories.risk:
      case radioCategories.assumption:
      case radioCategories.dependency:
        return 'Mitigation';
      case radioCategories.issue:
        return 'Resolution';
      case radioCategories.opportunity:
        return 'Action plan';
    }
  }

}
