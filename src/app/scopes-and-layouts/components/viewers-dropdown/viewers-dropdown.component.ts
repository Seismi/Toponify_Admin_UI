import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { ScopeService } from '@app/scope/services/scope.service';

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

  constructor(private scopeService: ScopeService) {}

  onSelect(event, viewer) {
    if(event.source.selected) {
      this.scopeService.selectedViewers.push(viewer)
    }
    if(!event.source.selected) {
      let index = this.scopeService.selectedViewers.indexOf(viewer);
      if(index > -1) {
        this.scopeService.selectedViewers.splice(index, 1);
      }
    }
  }
  
}