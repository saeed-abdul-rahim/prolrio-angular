import { CommonInterface, Role, TimestampInterface, Status } from './Common';

export type DisplayRole = 'Admin' | 'Teacher' | 'Student';
type Gender = 'Male' | 'Female' | 'Transgender' | '';

export interface User {
    uid: string;
    token: string;
    name: string;
    email: string;
    phone: string;
    expiry: number;
    groupId?: string;
    role?: Role;
    sudo?: boolean;
    allClaims?: UserClaim[];
}

export interface UserClaim {
    groupId: string;
    role: Role;
    sudo: boolean;
}

export interface UserInterface extends CommonInterface {
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
    dob?: string;
    gender?: Gender;
    photoUrl?: string;
    online?: boolean;
    lastSeen?: number;
    stripeId?: string;
    sudo?: string[];
    groupId?: string[];
    sectionId?: string[];
    subjectId?: string[];
    entityId?: string[];
    requests?: string[];
    groupRequests?: string[];
    tierId?: string;
    subscriptionId?: string;
    subscriptionStatus?: any;
    subscriptionItems?: any[];
    paymentMethodId?: string;
    [key: string]: any;
}

export const genders: Gender[] = [ 'Male', 'Female', 'Transgender' ];
export const roles: Role[] = [ 'admin', 'provider', 'learner' ];
export const displayRoles: DisplayRole[] = [ 'Admin', 'Teacher', 'Student' ];
export const displayRoleMap: Record<Role, DisplayRole> = {
    admin: 'Admin',
    provider: 'Teacher',
    learner: 'Student',
};

export interface UserAnalyticsInterface extends TimestampInterface {
    uid?: string;
    role?: Role;
    entityId?: string;
    status?: Status;
    name?: string;
    email?: string;
    phone?: string;
    lastSeen?: number;
    recentWatchTime?: number;
    recentTimeSpent?: number;
    totalWatchTime?: number;
    totalTimeSpent?: number;
    totalDownloads?: number;
    totalTimesPlayed?: number;
    totalTimesViewed?: number;
    downloaded?: boolean;
    viewed?: boolean;
    watched?: boolean;
    avgWatchTime?: number;
    avgTimeSpent?: number;
    totalComments?: number;
    dateViewed?: DateCount[];
    datePlayed?: DateCount[];
}

export interface DateCount {
    date: any;
    count: number;
}

export interface UsersEntity {
    uid?: string;
    role?: Role;
    entityId?: string;
    status?: Status;
    name?: string;
    email?: string;
    phone?: string;
    lastSeen?: number;
    downloaded?: boolean;
    viewed?: boolean;
    watched?: boolean;
    recentWatchTime?: number;
    recentTimeSpent?: number;
}

export interface AllUserAnalyticsInterface {
    users?: UsersEntity[];
    totalWatchTime?: number;
    totalTimeSpent?: number;
    totalDownloads?: number;
    totalTimesPlayed?: number;
    totalTimesViewed?: number;
    avgWatchTime?: number;
    avgTimeSpent?: number;
    totalComments?: number;
    dateViewed?: DateCount[];
    datePlayed?: DateCount[];
}

export class UserAnalytics implements UserAnalyticsInterface {
    users: UsersEntity[];
    totalWatchTime: number;
    totalTimeSpent: number;
    totalDownloads: number;
    totalTimesPlayed: number;
    totalTimesViewed: number;
    avgWatchTime: number;
    avgTimeSpent: number;
    totalComments: number;
    dateViewed: DateCount[];
    datePlayed: DateCount[];

    constructor(data?: AllUserAnalyticsInterface) {
        this.users = data && data.users ? data.users : [];
        this.totalWatchTime = data && data.totalWatchTime ? data.totalWatchTime : 0;
        this.totalTimesViewed = data && data.totalTimesViewed ? data.totalTimesViewed : 0;
        this.totalTimesPlayed = data && data.totalTimesPlayed ? data.totalTimesPlayed : 0;
        this.totalTimeSpent = data && data.totalTimeSpent ? data.totalTimeSpent : 0;
        this.totalDownloads = data && data.totalDownloads ? data.totalDownloads : 0;
        this.totalComments = data && data.totalComments ? data.totalComments : 0;
        this.avgTimeSpent = data && data.avgTimeSpent ? data.avgTimeSpent : 0;
        this.avgWatchTime = data && data.avgWatchTime ? data.avgWatchTime : 0;
        this.dateViewed = data && data.dateViewed ? data.dateViewed : [];
        this.datePlayed = data && data.datePlayed ? data.datePlayed : [];
    }

    get(): AllUserAnalyticsInterface {
        return {
            users: this.users,
            totalWatchTime: this.totalWatchTime,
            totalTimesViewed: this.totalTimesViewed,
            totalTimesPlayed: this.totalTimesPlayed,
            totalTimeSpent: this.totalTimeSpent,
            totalDownloads: this.totalDownloads,
            totalComments: this.totalComments,
            avgTimeSpent: this.avgTimeSpent,
            avgWatchTime: this.avgWatchTime,
            datePlayed: this.datePlayed,
            dateViewed: this.dateViewed
        };
    }
}
