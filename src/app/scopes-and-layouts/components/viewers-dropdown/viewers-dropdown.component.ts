import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { SharedService } from '@app/services/shared-service';

@Component({
  selector: 'smi-viewers-dropdown',
  templateUrl: './viewers-dropdown.component.html',
  styleUrls: ['./viewers-dropdown.component.scss']
})
export class ViewersDropdownComponent {
  teams: TeamEntity[];
  viewers = new FormControl();

  @Input()
  set data(data: any[]) {
    this.teams = data;
  }

  constructor(private sharedService: SharedService) {}

  onSelect(event, viewer) {
    if (event.source.selected) {
      this.sharedService.selectedViewers.push(viewer);
    }
    if (!event.source.selected) {
      const index = this.sharedService.selectedViewers.indexOf(viewer);
      if (index > -1) {
        this.sharedService.selectedViewers.splice(index, 1);
      }
    }
  }
}
