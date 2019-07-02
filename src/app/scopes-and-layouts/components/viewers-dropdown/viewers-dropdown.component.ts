import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';

@Component({
  selector: 'smi-viewers-dropdown',
  templateUrl: './viewers-dropdown.component.html',
  styleUrls: ['./viewers-dropdown.component.scss']
})
export class ViewersDropdownComponent {

  teams: TeamEntity[];
  viewers = new FormControl();
  @Input() selectedViewers = [];

  @Input()
  set data(data: any[]) {
    this.teams = data;
  }

  onSelect(event, viewer) {
    if(event.source.selected) {
      this.selectedViewers.push(viewer)
    }
    if(!event.source.selected) {
      let index = this.selectedViewers.indexOf(viewer);
      if(index > -1) {
        this.selectedViewers.splice(index, 1);
      }
    }
  }
  
}