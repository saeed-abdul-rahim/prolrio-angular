import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '@services/common/common.service';
import { LearnerService } from '@services/learner/learner.service';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  baseUrl: string;
  loading = false;
  displayEntities: any[] = [];
  userSubscription: Subscription;
  entitySubscription: Subscription;

  constructor(private commonService: CommonService, private learner: LearnerService,
              private auth: AuthService,
              private consoleNav: ConsoleNavService, private router: Router) {
  }

  ngOnInit(): void {
    const { groupId } = this.commonService.getUser();
    this.baseUrl = this.consoleNav.getBaseUrl();
    this.loading = true;
    this.userSubscription = this.auth.getCurrentUserDocument().subscribe(user => {
      const { subjectId } = user;
      this.entitySubscription = this.learner.getAllEntities(subjectId, groupId).subscribe(subEntities => {
        this.loading = false;
        const subEnts = [];
        subEntities.map(entities => {
          try {
            const displayEntities = {
              subjectId: entities[0].subjectId,
              subjectName: entities[0].subjectName,
              entities
            };
            subEnts.push(displayEntities);
          } catch (err) { }
        });
        this.displayEntities = subEnts;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
    if (this.entitySubscription && !this.entitySubscription.closed) { this.entitySubscription.unsubscribe(); }
  }

  navigateToEntity(entityId: string) {
    this.router.navigate([`${this.baseUrl}/entity`, entityId], { skipLocationChange: true });
  }

}
