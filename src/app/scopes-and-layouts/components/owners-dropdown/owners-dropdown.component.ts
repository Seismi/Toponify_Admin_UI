import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-owners-dropdown',
  templateUrl: './owners-dropdown.component.html',
  styleUrls: ['./owners-dropdown.component.scss']
})
export class OwnersDropdownComponent {

  teams: TeamEntity[];
  owners = new FormControl();
  @Input() selectedOwners = [];

  @Input()
  set data(data: any[]) {
    this.teams = data;
  }

  onSelect(event, owner) {
    if(event.source.selected) {
      this.selectedOwners.push(owner)
    }
    if(!event.source.selected) {
      let index = this.selectedOwners.indexOf(owner);
      if(index > -1) {
        this.selectedOwners.splice(index, 1);
      }
    }
  }
  
}