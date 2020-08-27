import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AdminGuard } from '@core/admin/admin.guard';
import { ProviderGuard } from '@core/provider/provider.guard';
import { LearnerGuard } from '@core/learner/learner.guard';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { CommonService } from '@services/common/common.service';
import { PaginationService } from '@services/pagination/pagination.service';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';

import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console.component';
import { ConsoleNavComponent } from './components/console-nav/console-nav.component';


@NgModule({
  declarations: [
    ConsoleComponent,
    ConsoleNavComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    AdminGuard,
    ProviderGuard,
    LearnerGuard,
    ConsoleNavService,
    CommonService,
    PaginationService
  ]
})
export class ConsoleModule { }
