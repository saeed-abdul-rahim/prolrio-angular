import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { ProviderService } from '@services/provider/provider.service';
import { UserAnalyticsInterface, AllUserAnalyticsInterface, UserAnalytics, DateCount, UserInterface } from '@models/User';
import snackBarSettings from '@settings/snackBar';
import { Role } from '@models/Common';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  sectionId: string;
  subjectId: string;
  entityId: string;

  faMessage = faEnvelope;
  faSearch = faSearch;

  public lineChartDataViewed: ChartDataSets[] = [];
  public lineChartDataPlayed: ChartDataSets[] = [];
  public lineChartLabelsViewed: Label[] = [];
  public lineChartLabelsPlayed: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: (label, index, labels) => {
              if (typeof(label) === 'string') {
                return label;
              } else if (Math.floor(label) === label) {
                return label;
              }
            }
          }
      }],
  },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'hsl(217, 71%, 45%)',
      backgroundColor: 'rgba(50, 115, 220, 0.3)',
    },
  ];

  displayedColumns: string[] = ['User Details'];
  tableData: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading = false;
  allUsers: UserInterface[];
  userAnalytics: AllUserAnalyticsInterface;
  usersNotViewed: string[] = [];
  usersNotWatched: string[] = [];
  usersNotDownloaded: string[] = [];

  selectedRole: Role = 'learner';
  notViewedSelected = true;
  notWatchedSelected = false;
  notDownloadedSelected = false;

  analyticsSubscription: Subscription;
  usageSubscription: Subscription;
  usersSubscription: Subscription;

  constructor(private provider: ProviderService, private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<AnalyticsComponent>, private cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any, private analytics: AngularFireAnalytics) {
    const { sectionId, subjectId, entityId } = data;
    this.sectionId = sectionId;
    this.subjectId = subjectId;
    this.entityId = entityId;
  }

  ngOnInit(): void {
    const { entityId, subjectId, sectionId, selectedRole } = this;
    if (entityId) {
      this.getAnalyticsByEntity(selectedRole);
      this.usageSubscription = this.provider.getUsageAnalytics(entityId).subscribe(content => {
        if (content && content[selectedRole]) {
          const { usersNotDownloaded, usersNotViewed, usersNotWatched } = content[selectedRole];
          this.usersNotDownloaded = usersNotDownloaded ? usersNotDownloaded : [];
          this.usersNotWatched = usersNotWatched ? usersNotWatched : [];
          this.usersNotViewed = usersNotViewed ? usersNotViewed : [];
          if (usersNotViewed && usersNotViewed.length > 0) {
            this.getUsers(usersNotViewed);
          }
        }
      });
    } else if (subjectId) {
      this.getAnalyticsBySubject(selectedRole);
      this.usageSubscription = this.provider.getUsageAnalytics(subjectId).subscribe();
    } else if ((sectionId !== 'admin') && (sectionId !== 'provider')) {
      this.getAnalyticsBySection(selectedRole);
      this.usageSubscription = this.provider.getUsageAnalytics(sectionId).subscribe();
    } else {
      this.getAnalyticsByGroup(selectedRole);
    }
  }

  ngOnDestroy(): void {
    if (this.analyticsSubscription && !this.analyticsSubscription.closed) {
      this.analyticsSubscription.unsubscribe();
    }
    if (this.usageSubscription && !this.usageSubscription.closed) {
      this.usageSubscription.unsubscribe();
    }
    this.unsubscribeUsers();
  }

  unsubscribeUsers() {
    if (this.usersSubscription && !this.usersSubscription.closed) {
      this.usersSubscription.unsubscribe();
    }
  }

  close() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  fillTable(allUsers: UserInterface[]) {
    try {
      this.allUsers = allUsers;
      this.tableData = new MatTableDataSource(allUsers);
      this.cdr.detectChanges();
      this.tableData.paginator = this.paginator;
    } catch (err) {
      this.openSnackBar('Unable to get users');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
    if (this.tableData.paginator) {
      this.tableData.paginator.firstPage();
    }
  }

  toggleNotViewed(type: 'viewed' | 'watched' | 'downloaded') {
    switch (type) {
      case 'viewed':
        this.notViewedSelected = true;
        this.notDownloadedSelected = false;
        this.notWatchedSelected = false;
        this.getUsers(this.usersNotViewed);
        break;
      case 'watched':
        this.notViewedSelected = false;
        this.notDownloadedSelected = false;
        this.notWatchedSelected = true;
        this.getUsers(this.usersNotWatched);
        break;
      case 'downloaded':
        this.notViewedSelected = false;
        this.notDownloadedSelected = true;
        this.notWatchedSelected = false;
        this.getUsers(this.usersNotDownloaded);
        break;
    }
  }

  async sendMessage(uid: string) {
    if (this.entityId) {
      try {
        await this.provider.sendEntityMessage(this.entityId, uid);
        this.openSnackBar('Message sent');
      } catch (err) {
        this.openSnackBar(err);
      }
    }
  }

  getUsers(users: string[]) {
    this.loading = true;
    this.unsubscribeUsers();
    this.usersSubscription = this.provider.getUsersData(users).subscribe(u => {
      this.fillTable(u);
      this.loading = false;
    },
    () => this.loading = false);
  }

  getAnalyticsByGroup(role: Role) {
    this.analytics.logEvent('analytics', { group: true });
    this.analyticsSubscription = this.provider.getAnalytics('', 'groupId', role).subscribe(ent => this.aggregateResult(ent));
  }

  getAnalyticsBySection(role: Role) {
    this.analytics.logEvent('analytics', { section: true });
    this.analyticsSubscription = this.provider.getAnalytics(this.sectionId, 'sectionIds', role).subscribe(ent => this.aggregateResult(ent));
  }

  getAnalyticsBySubject(role: Role) {
    this.analytics.logEvent('analytics', { subject: true });
    this.analyticsSubscription = this.provider.getAnalytics(this.subjectId, 'subjectId', role).subscribe(ent => this.aggregateResult(ent));
  }

  getAnalyticsByEntity(role: Role) {
    this.analytics.logEvent('analytics', { entity: true });
    this.analyticsSubscription = this.provider.getAnalytics(this.entityId, 'entityId', role).subscribe(ent => this.aggregateResult(ent));
  }

  aggregateResult(allUserAnalytics: UserAnalyticsInterface[]) {
    const userAnalytics = new UserAnalytics().get();
    allUserAnalytics.forEach(ua => {
      const {
        totalWatchTime, totalTimeSpent, totalTimesViewed, totalTimesPlayed, totalDownloads, totalComments,
        avgTimeSpent, avgWatchTime, dateViewed, datePlayed
       } = ua;
      userAnalytics.totalWatchTime += totalWatchTime;
      userAnalytics.totalTimeSpent += totalTimeSpent;
      userAnalytics.totalTimesViewed += totalTimesViewed;
      userAnalytics.totalTimesPlayed += totalTimesPlayed;
      userAnalytics.totalDownloads += totalDownloads;
      userAnalytics.totalComments += totalComments;
      userAnalytics.avgTimeSpent += avgTimeSpent;
      userAnalytics.avgWatchTime += avgWatchTime;
      if (userAnalytics.datePlayed.length === 0) {
        userAnalytics.datePlayed.push(...datePlayed);
      } else {
        userAnalytics.datePlayed = userAnalytics.datePlayed.map(uaDate => {
          const itemIndex = datePlayed.findIndex(date => date.date === uaDate.date);
          if (itemIndex > -1) {
              const item = datePlayed[itemIndex];
              uaDate.count += item.count;
          }
          return uaDate;
        });
      }
      if (userAnalytics.dateViewed.length === 0) {
        userAnalytics.dateViewed.push(...dateViewed);
      } else {
        userAnalytics.dateViewed = userAnalytics.dateViewed.map(uaDate => {
          const itemIndex = dateViewed.findIndex(date => new Date(date.date).valueOf() === new Date(uaDate.date).valueOf());
          if (itemIndex > -1) {
              const item = dateViewed[itemIndex];
              uaDate.date = new Date(item.date).valueOf();
              uaDate.count += item.count;
          }
          return uaDate;
        });
      }
    });
    if (userAnalytics.avgTimeSpent !== 0) {
      userAnalytics.avgTimeSpent = userAnalytics.avgTimeSpent / allUserAnalytics.length;
    }
    if (userAnalytics.avgWatchTime !== 0) {
      userAnalytics.avgWatchTime = userAnalytics.avgWatchTime / allUserAnalytics.length;
    }
    this.userAnalytics = userAnalytics;
    if (userAnalytics.dateViewed.length > 0) {
      const dateViewChart = this.createChartData(userAnalytics.dateViewed);
      this.lineChartDataViewed = dateViewChart.data;
      this.lineChartLabelsViewed = dateViewChart.label;
    }
    if (userAnalytics.dateViewed.length > 0) {
      const datePlayChart = this.createChartData(userAnalytics.datePlayed);
      this.lineChartDataPlayed = datePlayChart.data;
      this.lineChartLabelsPlayed = datePlayChart.label;
    }
  }

  createChartData(dayCount: DateCount[]) {
    dayCount = dayCount.sort((a, b) => a.date - b.date);
    dayCount = dayCount.slice(0, 30);
    const viewDayCount = dayCount.map(d => {
      return {
        day: new Date(d.date).getDate(),
        count: d.count
      };
    });
    const viewedDays: string[] = [];
    const viewedCount: number[] = [];
    viewDayCount.forEach(v => {
      viewedDays.push(v.day.toString());
      viewedCount.push(v.count);
    });
    return {
      data: [
        { data: viewedCount, label: 'Views per day' },
      ],
      label: viewedDays
    };
  }

  secondsToHms(d: number) {
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay + sDisplay;
}

}
