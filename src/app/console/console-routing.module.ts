import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsoleComponent } from './console.component';
import { AdminGuard } from '@core/admin/admin.guard';
import { ProviderGuard } from '@core/provider/provider.guard';
import { LearnerGuard } from '@core/learner/learner.guard';

const routes: Routes = [
  {
    path: '', component: ConsoleComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canLoad: [AdminGuard]
      },
      {
        path: 'provider',
        loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule),
        canLoad: [ProviderGuard]
      },
      {
        path: 'learner',
        loadChildren: () => import('./learner/learner.module').then(m => m.LearnerModule),
        canLoad: [LearnerGuard]
      },
      {
        path: 'group',
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule { }
