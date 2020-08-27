import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons/faArrowCircleRight';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons/faArrowCircleLeft';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';

import { CommonService } from '@services/common/common.service';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { Role } from '@models/Common';
import { EntityInterface } from '@models/Entity';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { EditEntityComponent } from '../edit-entity/edit-entity.component';
import { first } from 'rxjs/operators';
import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
import { UserAnalyticsInterface } from '@models/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit, OnDestroy {

  faArrowCircleRight = faArrowCircleRight;
  faArrowCircleLeft = faArrowCircleLeft;
  faEdit = faEdit;

  baseUrl: string;
  uid: string;
  role: Role;
  showEdit = false;
  routeParamSubscription: Subscription;
  allEntitySubscription: Subscription;
  subjectSubscription: Subscription;

  fileLoading = false;
  focused = true;

  entityId: string;
  entities: EntityInterface[];
  entity: EntityInterface;
  next: EntityInterface;
  previous: EntityInterface;

  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  videoSources: Plyr.Source[] = [];
  player: Plyr;
  paused: boolean;

  watchCounter;
  viewCounter;

  // ANALYTICS
  lastSeen: number;
  recentWatchTime = 0;
  recentTimeSpent = 0;
  downloaded: boolean;
  viewed: boolean;
  watched: boolean;
  userAnalytics: UserAnalyticsInterface;

  constructor(private commonService: CommonService, private consoleNav: ConsoleNavService, private snackBar: MatSnackBar,
              private route: ActivatedRoute, private router: Router, private matDialog: MatDialog) {
    const { role, uid } = this.commonService.getUser();
    this.uid = uid;
    this.role = role;
    this.allEntitySubscription = this.commonService.getAllEntities().subscribe(entities => {
      this.routeParamSubscription = this.route.params.subscribe(params => {
        if (params.entityId) {
          const { entityId } = params;
          try {
            this.entities = entities;
            this.entity = this.entities.find(ent => ent.id === entityId);
            if (this.entity) {
              this.entityId = entityId;
              this.viewed = true;
            }
            const { contentType } = this.entity;
            if (contentType === 'video') {
              const source = {
                src: this.entity.contentUrl,
                type: `${this.entity.contentType}/mp4`
              };
              this.videoSources.push(source);
            }
            this.setViewed();
            this.getSubject();
            this.next = this.entities.find(ent => this.entity.order + 1 === ent.order);
            this.previous = this.entities.find(ent => this.entity.order - 1 === ent.order);
          } catch (err) {
            this.commonService.getThreeEntities(entityId);
          }
        }
      });
    });
  }

  ngOnInit(): void {
    this.baseUrl = this.consoleNav.getBaseUrl();
    this.viewed = true;
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription && !this.routeParamSubscription.closed) {
      this.routeParamSubscription.unsubscribe();
    }
    if (this.allEntitySubscription && !this.allEntitySubscription.closed) {
      this.allEntitySubscription.unsubscribe();
    }
    if (this.subjectSubscription && !this.subjectSubscription.closed) {
      this.subjectSubscription.unsubscribe();
    }
    if (this.recentTimeSpent !== 0 || this.recentWatchTime !== 0) {
      this.setAnalytics({
        recentTimeSpent: this.recentTimeSpent,
        recentWatchTime: this.recentWatchTime
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  setViewCounter() {
    this.recentTimeSpent = 1;
    clearInterval(this.viewCounter);
    this.viewCounter = setInterval(() => {
      if (this.focused) {
        this.recentTimeSpent += 1;
      }
    }, 1000);
  }

  setWatchCounter() {
    this.recentWatchTime = 1;
    clearInterval(this.watchCounter);
    this.watchCounter = setInterval(() => {
      if (!this.paused) {
        this.recentWatchTime += 1;
      }
    }, 1000);
  }

  getSubject() {
    this.subjectSubscription = this.commonService.getCurrentSubject().subscribe(subject => {
      if (!subject) {
        this.commonService.setCurrentSubject(this.entity.subjectId);
      }
      if (subject && subject.provider.includes(this.uid)) {
        this.showEdit = true;
      } else {
        this.showEdit = false;
      }
    });
  }

  setViewed() {
    this.viewed = true;
    this.setViewCounter();
    this.commonService.setAnalytics({
      entityId: this.entityId,
      viewed: this.viewed
    });
  }

  async getFile(link: string) {
    try {
      this.fileLoading = true;
      await this.commonService.getFileFromLink(link, this.entity.title);
      this.downloaded = true;
      this.fileLoading = false;
      this.setAnalytics({ downloaded: this.downloaded });
    } catch (err) {
      this.openSnackBar('Unable to get file');
    }
  }

  editModal() {
    const { id, title, description } = this.entity;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { id, title, description };
    this.matDialog.open(EditEntityComponent, dialogConfig);
  }

  play(event: Plyr.PlyrEvent) {
    this.paused = false;
    if (!this.watched) {
      this.watched = true;
      this.setAnalytics({ watched: this.watched });
    }
    this.setWatchCounter();
  }

  playing(event: Plyr.PlyrEvent) {
    this.paused = false;
  }

  pause(event: Plyr.PlyrEvent) {
    const { recentWatchTime } = this;
    this.setAnalytics({ recentWatchTime });
    clearInterval(this.watchCounter);
    this.recentWatchTime = 0;
  }

  waiting(event: Plyr.PlyrEvent) {
    this.paused = true;
  }

  setAnalytics(data: UserAnalyticsInterface) {
    const { entityId } = this;
    this.commonService.setAnalytics({ entityId, ...data });
  }

  async navigateToEntity(entityId: string, label: string) {
    this.consoleNav.popUrl();
    const breadcrumb = await this.consoleNav.getUrl().pipe(first()).toPromise();
    if (breadcrumb.length > 1) {
      const url = `${this.baseUrl}/entity/${entityId}`;
      this.consoleNav.pushUrl({ label, url });
    }
    this.router.navigate([`${this.baseUrl}/entity`, entityId]);
  }

  @HostListener('window:beforeunload', ['$event'])
  sendAnalytics(event: Event) {
    if (this.recentTimeSpent !== 0 || this.recentWatchTime !== 0) {
      this.setAnalytics({
        recentTimeSpent: this.recentTimeSpent,
        recentWatchTime: this.recentWatchTime
      });
    }
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: Event) {
    this.focused = false;
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: Event) {
    this.focused = true;
  }

}
