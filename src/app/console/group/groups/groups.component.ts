import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { User, UserClaim, UserInterface } from '@models/User';
import { AuthService } from '@core/auth.service';
import { RemoveComponent } from '@components/remove/remove.component';
import { GroupService } from '@services/group/group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import localStorageHelper from '@utils/localStorageHelper';
import { environment } from '@environment';
import { Subscription } from 'rxjs';
import { arrayEqual } from '@utils/arrayEqual';
import { MetadataInterface } from '@models/Metadata';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {

  user: User;
  userDoc: UserInterface;
  claims: Array<any>;
  groups: MetadataInterface[] = [];
  groupsInvited: MetadataInterface[] = [];
  loading = false;

  userSubscription: Subscription;
  userDocSubscription: Subscription;
  metadataSubscription: Subscription;

  localStorageKey: string;
  localKey: any;

  constructor(private router: Router, private auth: AuthService, private matDialog: MatDialog,
              private snackBar: MatSnackBar, private group: GroupService) {
    const { localStorageKey } = environment;
    this.localStorageKey = localStorageKey;
  }

  ngOnInit(): void {
    this.localKey = localStorageHelper.getItem(this.localStorageKey);
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => {
      this.user = user;
      if (user && user.allClaims) {
        this.claims = this.user.allClaims;
      } else if (user && user.groupId && user.role) {
        const { groupId, role, sudo } = this.user;
        this.claims = [ { groupId, role, sudo } ];
      } else {
        this.claims = [];
      }
    });
    this.userDocSubscription = this.auth.getCurrentUserDocument().subscribe(user => {
      this.loading = true;
      setTimeout(() => {
        if (user.groupId.length > 0 && (!this.user.allClaims || this.user.allClaims?.length === 0)) {
          this.auth.getUser();
        } else if (this.user.allClaims) {
          const { allClaims } = this.user;
          const groupIds = allClaims.map(g => g.groupId).reduce((a: string[], b) => a.concat(b), []);
          if (!arrayEqual(groupIds, user.groupId)) {
            if (this.localKey.current) {
              delete this.localKey.current;
              localStorageHelper.setItem(this.localStorageKey, { ...this.localKey });
            }
            this.auth.getUser();
          }
        }
      }, 5000);
      if (user.groupId.length > 0) {
        this.unsubscribeMetadata();
        this.metadataSubscription = this.group.getGroups(user.groupId).subscribe(groups => {
          this.loading = false;
          this.groups = groups.filter(grp => !user.groupRequests.includes(grp.id));
          this.groupsInvited = groups.filter(grp => user.groupRequests.includes(grp.id));
        });
      } else {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
    if (this.userDocSubscription && !this.userDocSubscription.closed) {
      this.userDocSubscription.unsubscribe();
    }
    this.unsubscribeMetadata();
  }

  unsubscribeMetadata() {
    if (this.metadataSubscription && !this.metadataSubscription.closed) {
      this.metadataSubscription.unsubscribe();
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  createDialog(data: any) {
    const dialogConfig = new MatDialogConfig();
    const config = {
      ...dialogConfig,
      closeOnNavigation: true,
      data
    };
    return config;
  }

  openDialog(dialogConfig: MatDialogConfig, fn: (id: string) => void) {
    this.matDialog.open(RemoveComponent, dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe(exec => {
        if (exec) { fn(dialogConfig.data.input); }
      }
    );
  }

  removeGroupDialog(groupId: string) {
    const action = 'Delete';
    const data = {
      title: `${action} ${groupId}?`,
      input: groupId,
      buttonName: action,
      danger: true
    };
    const dialogConfig = this.createDialog(data);
    this.openDialog(dialogConfig, () => this.removeGroup(groupId));
  }

  exitGroupDialog(groupId: string) {
    const action = 'Exit';
    const data = {
      title: `${action} from ${groupId}?`,
      buttonName: action
    };
    const dialogConfig = this.createDialog(data);
    this.openDialog(dialogConfig, () => this.exitGroup(groupId));
  }

  async acceptRequest(groupId: string) {
    this.setInvitationLoading(groupId, true);
    try {
      await this.group.acceptRequest(groupId);
      this.openSnackBar('Invitation accepted');
      await this.setClaim(groupId);
    } catch (err) {
      this.openSnackBar('Unable to accept request. Please try again');
    }
    this.setInvitationLoading(groupId, false);
  }

  async rejectRequest(groupId: string) {
    this.setInvitationLoading(groupId, true);
    try {
      await this.group.removeUserFromGroup(groupId, this.user.uid);
      this.filterOutGroup(groupId);
      this.openSnackBar('Invitation rejected');
    } catch (err) {
      this.openSnackBar('Unable to reject. Please try again');
    }
    this.setInvitationLoading(groupId, false);
  }

  async exitGroup(groupId: string) {
    this.setLoading(groupId, true);
    try {
      await this.group.removeUserFromGroup(groupId, this.user.uid);
      this.filterOutGroup(groupId);
      this.openSnackBar('Successfully removed');
    } catch (err) {
      this.openSnackBar('Unable to exit group');
    }
    this.setLoading(groupId, false);
  }

  async removeGroup(groupId: string) {
    this.setLoading(groupId, true);
    try {
      await this.group.remove(groupId);
      this.filterOutGroup(groupId);
    } catch (err) {
      this.openSnackBar('Unable to remove group');
    }
    this.setLoading(groupId, false);
  }

  isSudo(groupId: string) {
    if (this.userDoc && this.userDoc.sudo.includes(groupId)) {
      return true;
    } else {
      return false;
    }
  }

  filterOutGroup(groupId: string) {
    this.claims = this.claims.filter(user => user.groupId !== groupId);
    this.groups = this.groups.filter(grp => grp.id !== groupId);
    this.groupsInvited = this.groupsInvited.filter(grp => grp.id !== groupId);
    if (this.user.groupId === groupId) {
      const claim = {
        groupId: undefined,
        role: undefined,
        sudo: undefined
      };
      this.auth.setUser({ ...this.user, ...claim });
    }
  }

  setLoading(groupId: string, loading: boolean) {
    this.groups.find(group => group.id === groupId && ( group.loading = loading, true ));
  }

  setInvitationLoading(groupId: string, loading: boolean) {
    this.groupsInvited.find(group => group.id === groupId && ( group.loading = loading, true ));
  }

  async setClaim(groupId: string) {
    const group = this.claims.find(claim => claim.groupId === groupId) as UserClaim;
    if (group.groupId && group.role) {
      const { role } = group;
      localStorageHelper.setItem(this.localStorageKey, { ...this.localKey, current: window.btoa(groupId) });
      await this.auth.setGroup(group);
      this.router.navigateByUrl(`console/${role}`, { skipLocationChange: true });
    }
  }

}
