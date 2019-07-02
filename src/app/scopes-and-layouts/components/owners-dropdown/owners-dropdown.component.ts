import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { ScopeService } from '@app/scope/services/scope.service';

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

  constructor(private scopeService: ScopeService) {}

  onSelect(event, owner) {
    if(event.source.selected) {
      this.scopeService.selectedScopes.push(owner)
    }
    if(!event.source.selected) {
      let index = this.scopeService.selectedScopes.indexOf(owner);
      if(index > -1) {
        this.scopeService.selectedScopes.splice(index, 1);
      }
    }
  }
  
}