import { Component, OnInit, OnDestroy, Injector, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription, BehaviorSubject } from 'rxjs';

import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { CommonService } from '@services/common/common.service';
import snackBarSettings from '@settings/snackBar';

import { RemoveEntityComponent } from '../remove-entity/remove-entity.component';
import { EntityInterface } from '@models/Entity';
import { copyArray } from '@utils/deepCopy';
import { Role } from '@models/Common';
import { ConsoleNav } from '@services/console-nav/ConsoleNav';
import { faSave, faExpandArrowsAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ProviderService } from '@services/provider/provider.service';
import { PaginationService } from '@services/pagination/pagination.service';
import { environment } from '@environment';
import { SubjectInterface } from '@models/Subject';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit, OnDestroy {

  uid: string;
  role: Role;
  private provider: ProviderService;

  baseUrl: string;
  entityLoader = false;
  orderChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean> (false);
  orderChanged$ = this.orderChanged.asObservable();
  entityData: EntityInterface[];
  originalEntityData: EntityInterface[];
  partialData: EntityInterface[] = [];
  currentSubject: SubjectInterface;
  subjectId: string;

  faEdit = faEdit;
  faSave = faSave;
  faExpand = faExpandArrowsAlt;
  navItems: ConsoleNav[];
  navSave = { text: 'Save', icon: faSave, function: () => this.saveEntities() };
  loading = false;
  showEdit = false;
  edit = false;
  allEntityLoaded = false;

  partialDataSubscription: Subscription;
  subjectSubscription: Subscription;
  entitySubscription: Subscription;
  entityLoaderSubscription: Subscription;
  entityErrorSubscription: Subscription;
  routeParamSubscription: Subscription;
  consoleNavSubscription: Subscription;

  constructor(private commonService: CommonService, private injector: Injector, public page: PaginationService,
              private consoleNav: ConsoleNavService, private matDialog: MatDialog,
              private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    const { role, uid } = this.commonService.getUser();
    this.uid = uid;
    this.role = role;
    if (this.role !== 'learner') {
      this.provider = this.injector.get(ProviderService) as ProviderService;
      this.consoleNavSubscription = this.consoleNav.getNavItems().subscribe(items => this.navItems = items);
    }
  }

  ngOnInit(): void {
    this.baseUrl = this.consoleNav.getBaseUrl();
    this.routeParamSubscription = this.route.params.subscribe(params => {
      if (params.subjectId) {
        const { subjectId } = params;
        this.consoleNav.setSubjectId(subjectId);
        this.subjectId = subjectId;
        if (this.role !== 'admin') {
          this.commonService.setCurrentSubject(subjectId);
          this.commonService.getCurrentSubject().subscribe(subject => {
            if (subject && subject.provider.includes(this.uid)) {
              this.showEdit = true;
            } else {
              this.showEdit = false;
            }
          });
        }
        this.getEntity();
      } else {
        this.openSnackBar('Unable to load Subject');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription && !this.routeParamSubscription.closed) {
      this.routeParamSubscription.unsubscribe();
    }
    if (this.subjectSubscription && !this.subjectSubscription.closed) {
      this.subjectSubscription.unsubscribe();
    }
    if (this.entitySubscription && !this.entitySubscription.closed) {
      this.entitySubscription.unsubscribe();
    }
    if (this.partialDataSubscription && !this.partialDataSubscription) {
      this.partialDataSubscription.unsubscribe();
    }
    if (this.entityLoaderSubscription && !this.entityLoaderSubscription.closed) {
      this.entityLoaderSubscription.unsubscribe();
    }
    if (this.entityErrorSubscription && !this.entityErrorSubscription.closed) {
      this.entityErrorSubscription.unsubscribe();
    }
    if (this.consoleNavSubscription && !this.consoleNavSubscription.closed) {
      this.consoleNavSubscription.unsubscribe();
    }
    this.page.onDestroy();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  removeEntityDialog(id: string, name: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id, name };
    this.matDialog.open(RemoveEntityComponent, dialogConfig);
  }

  drop(event: CdkDragDrop<string[]>) {
    const { currentIndex, previousIndex } = event;
    moveItemInArray(this.entityData, previousIndex, currentIndex);
    this.entityData = this.entityData.map((entity, index) => {
      entity.order = index;
      return entity;
    });
    this.checkEntityOrder();
  }

  getEntity() {
    if (this.role !== 'learner') {
      this.getAllEntity();
    } else {
      this.getPartialEntity();
    }
  }

  checkEntityOrder() {
    const allChanges = this.originalEntityData.map(origEnt => {
      const entity = this.entityData.find(ent => ent.id === origEnt.id);
      if (entity.order !== origEnt.order) { return true; }
      else { return false; }
    });
    if (allChanges.includes(true)) { this.orderChanged.next(true); }
    else { this.orderChanged.next(false); }
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  getAllEntity() {
    this.entityLoader = true;
    this.commonService.getEntities(this.subjectId);
    this.entityLoaderSubscription = this.commonService.entitiesLoader.subscribe(load => this.entityLoader = load);
    this.entityErrorSubscription = this.commonService.entitiesError.subscribe(error => {
      if (error) { this.openSnackBar(error); }
    });
    this.entitySubscription = this.commonService.getAllEntities().subscribe(data => {
      this.entityData = data;
      this.partialData = data;
      this.originalEntityData = copyArray(data);
    });
  }

  getPartialEntity() {
    const { db } = environment;
    this.page.init(db.entities, 'order', { subjectId: this.subjectId });
    this.partialDataSubscription = this.page.data.subscribe((data: EntityInterface[]) => {
      this.partialData = [];
      if (data && data.length > 0) {
        data.forEach(ent => {
          if (this.partialData.some(ed => ed.id === ent.id)) {
            const idx = this.partialData.findIndex(ed => ed.id === ent.id);
            this.partialData[idx] = ent;
          } else {
            this.partialData.push(ent);
          }
        });
      } else { this.partialData = []; }
    });
  }

  async saveEntities() {
    this.loading = true;
    try {
      await this.provider.updateEntities(this.entityData);
      this.orderChanged.next(false);
      this.openSnackBar('Successfully Saved');
    } catch (err) {
      if (err) { this.openSnackBar(err); }
      else { this.openSnackBar('Unable to save Entities'); }
    }
    this.loading = false;
  }

  navigateToEntity(entityId: string, label: string) {
    const url = `${this.baseUrl}/entity/${entityId}`;
    this.consoleNav.pushUrl({ label, url });
    this.router.navigate([`${this.baseUrl}/entity`, entityId]);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.role !== 'learner') { return; }
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.page.more();
    }
  }

}
