import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { CommonService } from '@services/common/common.service';
import snackBarSettings from '@settings/snackBar';
import { Role } from '@models/Common';

import { RemoveDivisionComponent } from '../../admin/components/remove-division/remove-division.component';
import { UpdateDivisionComponent } from 'app/console/admin/components/update-division/update-division.component';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit, OnDestroy {

  baseUrl: string;
  sectionData$: any;
  subjectData$: any;

  role: Role;
  routeParamSubscription: Subscription;

  constructor(private commonService: CommonService, private snackBar: MatSnackBar, private matDialog: MatDialog,
              private router: Router, private route: ActivatedRoute, private consoleNav: ConsoleNavService) {
    const { role } = this.commonService.getUser();
    this.role = role;
  }

  ngOnInit(): void {
    this.baseUrl = this.consoleNav.getBaseUrl();
    this.routeParamSubscription = this.route.params.subscribe(params => {
      if (params.sectionId) {
        const { sectionId } = params;
        this.consoleNav.setSectionId(sectionId);
        this.getSection(sectionId);
        this.getSubject(sectionId);
      } else {
        this.consoleNav.setSectionId('');
        this.getSection();
        this.getSubject();
      }
   });
  }

  ngOnDestroy() {
    if (this.routeParamSubscription && !this.routeParamSubscription.closed) { this.routeParamSubscription.unsubscribe(); }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  getSection(sectionId = '') {
    this.sectionData$ = this.commonService.getSections(sectionId);
  }

  getSubject(subjectId = '') {
    this.subjectData$ = this.commonService.getSubjects(subjectId);
  }

  removeSection(id: string, name: string) {
    this.divisionDialog(id, name, 'section', 'delete');
  }

  removeSubject(id: string, name: string) {
    this.divisionDialog(id, name, 'subject', 'delete');
  }

  updateSection(id: string, name: string) {
    this.divisionDialog(id, name, 'section', 'update');
  }

  updateSubject(id: string, name: string) {
    this.divisionDialog(id, name, 'subject', 'update');
  }

  divisionDialog(id: string, name: string, type: 'section' | 'subject', action: 'update' | 'delete') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id, name, type };
    if (action === 'delete') { this.matDialog.open(RemoveDivisionComponent, dialogConfig); }
    if (action === 'update') { this.matDialog.open(UpdateDivisionComponent, dialogConfig); }
  }

  navigateToSection(sectionId: string, label: string) {
    const url = `${this.baseUrl}/section/${sectionId}`;
    this.consoleNav.pushUrl({ label, url });
    this.router.navigate([`${this.baseUrl}/section`, sectionId]);
  }

  navigateToSubject(subjectId: string, label: string) {
    const url = `${this.baseUrl}/subject/${subjectId}`;
    this.consoleNav.pushUrl({ label, url });
    this.router.navigate([`${this.baseUrl}/subject`, subjectId]);
  }

}
