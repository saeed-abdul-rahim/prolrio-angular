import { HttpClient } from '@angular/common/http';
import { User } from '@models/User';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth.service';

export interface SuccessResponse {
    data: any;
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
  })
export class Request {

    private user: User;

    constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
        this.auth.getCurrentUserStream().subscribe(user => this.user = user);
    }

    private async setDefaultHeaders() {
        try {
            if (this.user.expiry < Date.now()) {
                await this.auth.getUser();
            }
            const { token, groupId } = this.user;
            return {
                Authorization: `Bearer ${token}`,
                groupId: groupId ? groupId : '',
            };
        } catch (err) {
            throw err;
        }
    }

    async post(url: string, data: any) {
        try {
            const headers = await this.setDefaultHeaders();
            const result = await this.http.post<SuccessResponse>(url, data, { headers }).toPromise();
            return result.data;
        } catch (err) {
            this.errorHandler(err);
        }
    }

    async get(url: string) {
        try {
            const headers = await this.setDefaultHeaders();
            const result = await this.http.get<SuccessResponse>(url, { headers }).toPromise();
            return result.data;
        } catch (err) {
            this.errorHandler(err);
        }
    }

    async patch(url: string, data: any) {
        try {
            const headers = await this.setDefaultHeaders();
            const result = await this.http.patch<SuccessResponse>(url, data, { headers }).toPromise();
            return result.data;
        } catch (err) {
            this.errorHandler(err);
        }
    }

    async put(url: string, data: any) {
        try {
            const headers = await this.setDefaultHeaders();
            const result = await this.http.put<SuccessResponse>(url, data, { headers }).toPromise();
            return result.data;
        } catch (err) {
            this.errorHandler(err);
        }
    }

    async delete(url: string) {
        try {
            const headers = await this.setDefaultHeaders();
            const result = await this.http.delete<SuccessResponse>(url, { headers }).toPromise();
            return result.data;
        } catch (err) {
            this.errorHandler(err);
        }
    }

    private errorHandler(err: any) {
        if (err.status === 401) { this.router.navigateByUrl('/'); }
        const { error, message } = err;
        if (error) { throw error.message; }
        else { throw message; }
    }
}
