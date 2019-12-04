import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-wp-owners-dropdown',
  templateUrl: './wp-owners-dropdown.component.html',
  styleUrls: ['./wp-owners-dropdown.component.scss']
})
export class WpOwnersDropdownComponent {
  teams: TeamEntity[];
  owners = new FormControl();
  @Input() selectedOwners = [];

  @Input()
  set data(data: any[]) {
    this.teams = data;
  }

  constructor() {}

  onSelect(event, owner) {
    if (event.source.selected) {
      this.selectedOwners.push(owner);
    }
    if (!event.source.selected) {
      const index = this.selectedOwners.indexOf(owner);
      if (index > -1) {
        this.selectedOwners.splice(index, 1);
      }
    }
  }
}
