import { Component, OnInit, OnDestroy } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TierInterface } from '@models/Tier';
import { User } from '@models/User';
import { PublicService } from '@services/public/public.service';
import { AuthService } from '@core/auth.service';
import currencyList from '@utils/currencyList';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {

  exchangeRate = null;
  currencyCode = null;
  currencySymbol = null;

  tiers: TierInterface[];
  free: TierInterface;
  payAsYouGo: TierInterface;

  user: User;
  userSubscription: Subscription;

  constructor(private publicService: PublicService, private auth: AuthService, private router: Router) {
    this.getCurrency();
    this.getTiers();
  }

  ngOnInit(): void {
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
  }

  async getTiers() {
    this.tiers = await this.publicService.getTiers();
    this.free = this.tiers.find(t => t.tierId === 'free');
    this.payAsYouGo = this.tiers.find(t => t.tierId === 'pay-as-you-go');
  }

  async getCurrency() {
    try {
      const countryCode = await this.publicService.getLocation();
      this.currencyCode = currencyList[countryCode];
      this.currencySymbol = getCurrencySymbol(this.currencyCode, 'narrow');
      this.exchangeRate = await this.publicService.getExchangeRate(this.currencyCode);
    } catch (err) {}
  }

  navigate() {
    if (this.user) {
      this.router.navigate(['console']);
    } else {
      this.router.navigate(['auth']);
    }
  }

}
