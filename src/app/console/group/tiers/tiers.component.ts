import { Component, OnInit, OnDestroy } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons/faCreditCard';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons/faCcVisa';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons/faCcMastercard';
import { faCcJcb } from '@fortawesome/free-brands-svg-icons/faCcJcb';
import { faCcDiscover } from '@fortawesome/free-brands-svg-icons/faCcDiscover';
import { faCcDinersClub } from '@fortawesome/free-brands-svg-icons/faCcDinersClub';
import { faCcAmex } from '@fortawesome/free-brands-svg-icons/faCcAmex';

import snackBarSettings from '@settings/snackBar';
import { GroupService } from '@services/group/group.service';
import { TierInterface } from '@models/Tier';
import { UserInterface } from '@models/User';
import { AuthService } from '@core/auth.service';
import { PublicService } from '@services/public/public.service';
import currencyList from '@utils/currencyList';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-tiers',
  templateUrl: './tiers.component.html',
  styleUrls: ['./tiers.component.scss']
})
export class TiersComponent implements OnInit, OnDestroy {

  faCard = faCreditCard;
  faVisa = faCcVisa;
  faMasterCard = faCcMastercard;
  faJcb = faCcJcb;
  faDiscover = faCcDiscover;
  faDinersClub = faCcDinersClub;
  faAmex = faCcAmex;

  createSubLoading = false;
  cancelSubLoading = false;
  invoiceLoading = false;
  cardLoading = false;
  removeCardLoading = false;

  exchangeRate = null;
  currencyCode = null;
  currencySymbol = null;

  invoice: any;
  tiers: TierInterface[];
  free: TierInterface;
  payAsYouGo: TierInterface;

  user: UserInterface;
  cards: any[];
  userSubscription: Subscription;
  cardsSubscription: Subscription;

  constructor(private group: GroupService, private auth: AuthService, private publicService: PublicService,
              private matDialog: MatDialog, private snackBar: MatSnackBar) {
    this.getCurrency();
    this.getTiers();
  }

  ngOnInit(): void {
    this.userSubscription = this.auth.getCurrentUserDocument().subscribe(user => {
      this.user = user;
      if (user.paymentMethodId) {
        this.getCards();
        this.createCardSubscription();
      }
      if (user.subscriptionId) { this.getInvoice(); }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
    this.destroyCardSubscription();
  }

  createCardSubscription() {
    this.cardsSubscription = this.group.getCardsStream().subscribe(cards => {
      this.cards = cards;
    });
  }

  destroyCardSubscription() {
    if (this.cardsSubscription && !this.cardsSubscription.closed) { this.cardsSubscription.unsubscribe(); }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async getTiers() {
    this.tiers = await this.publicService.getTiers();
    this.free = this.tiers.find(t => t.tierId === 'free');
    this.payAsYouGo = this.tiers.find(t => t.tierId === 'pay-as-you-go');
  }

  addCardDialog() {
    const config = this.openDialog();
    this.matDialog.open(PaymentComponent, config);
  }

  addCardThenSubscribe(id: string) {
    const config = this.openDialog();
    config.data = { id };
    this.createSubLoading = true;
    this.matDialog.open(PaymentComponent, config).afterClosed().subscribe(
      async success => {
        if (success) {
          await this.getCards();
          this.destroyCardSubscription();
          this.createCardSubscription();
          if (this.cardLoading === false && this.cards) {
            await this.createSubscrption(id);
          } else {
            this.openSnackBar('Unable to fetch cards');
            this.createSubLoading = false;
          }
        } else { this.createSubLoading = false; }
      },
      () => {
        this.openSnackBar('Unable to save card');
        this.createSubLoading = false;
      }
    );
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    const config = {
      ...dialogConfig,
      closeOnNavigation: true,
      width: '100%',
      panelClass: 'full-screen-modal'
    };
    return config;
  }

  async removeCard(id: string) {
    this.removeCardLoading = true;
    try {
      await this.group.removeCard(id);
      await this.getCards();
    } catch (err) {
      this.openSnackBar(err);
    }
    this.removeCardLoading = false;
  }

  async createSubscrption(id: string) {
    this.createSubLoading = true;
    try {
      await this.group.createSubscription(id);
    } catch (err) {
      this.openSnackBar(err);
    }
    this.createSubLoading = false;
  }

  async cancelSubscrption() {
    this.cancelSubLoading = true;
    try {
      await this.group.cancelSubscription();
    } catch (err) {
      this.openSnackBar(err);
    }
    this.cancelSubLoading = false;
  }

  async getInvoice() {
    this.invoiceLoading = true;
    try {
      this.invoice = await this.group.getInvoice();
    } catch (err) {
      if (!err.includes('invoice_upcoming_none')) {
        this.openSnackBar(err);
      }
    }
    this.invoiceLoading = false;
  }

  async getCards() {
    this.cardLoading = true;
    try {
      await this.group.getCards();
    } catch (err) {
      this.cards = null;
    }
    this.cardLoading = false;
  }

  async getCurrency() {
    try {
      const countryCode = await this.publicService.getLocation();
      this.currencyCode = currencyList[countryCode];
      this.currencySymbol = getCurrencySymbol(this.currencyCode, 'narrow');
      this.exchangeRate = await this.publicService.getExchangeRate(this.currencyCode);
    } catch (err) {}
  }

  async subscriptionFlow(id: string) {
    if (!this.user.paymentMethodId) {
      this.addCardThenSubscribe(id);
    } else {
      this.createSubscrption(id);
    }
  }

}
