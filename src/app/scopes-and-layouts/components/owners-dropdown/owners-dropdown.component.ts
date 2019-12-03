import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { SharedService } from '@app/services/shared-service';

@Component({
  selector: 'smi-owners-dropdown',
  templateUrl: './owners-dropdown.component.html',
  styleUrls: ['./owners-dropdown.component.scss']
})
export class OwnersDropdownComponent {
  teams: TeamEntity[];
  owners = new FormControl();

  @Input()
  set data(data: any[]) {
    this.teams = data;
  }

  constructor(private sharedService: SharedService) {}

  onSelect(event, owner) {
    if (event.source.selected) {
      this.sharedService.selectedOwners.push(owner);
    }
    if (!event.source.selected) {
      const index = this.sharedService.selectedOwners.indexOf(owner);
      if (index > -1) {
        this.sharedService.selectedOwners.splice(index, 1);
      }
    }
  }
}
