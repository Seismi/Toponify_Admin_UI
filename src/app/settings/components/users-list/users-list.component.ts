import { Component, Input } from '@angular/core';
import { User } from '@app/settings/store/models/user.model';

@Component({
    selector: 'smi-users-list',
    templateUrl: 'users-list.component.html',
    styleUrls: ['users-list.component.scss']
})
export class UsersListComponent {

    members: any[];

    @Input()
    set data(data: User[]) {
        this.members = data;
    }

}