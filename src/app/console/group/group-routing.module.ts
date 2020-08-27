import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './group.component';
import { JoinComponent } from './join/join.component';
import { CreateComponent } from './create/create.component';
import { GroupsComponent } from './groups/groups.component';
import { TiersComponent } from './tiers/tiers.component';

const routes: Routes = [
  { path: '', component: GroupComponent, children: [
    { path: '', component: GroupsComponent },
    { path: 'join', component: JoinComponent },
    { path: 'create', component: CreateComponent },
    { path: 'tier', component: TiersComponent },
    { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
