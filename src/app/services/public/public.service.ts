import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from '@environment';
import { Message } from './Message';
import { TierInterface } from '@models/Tier';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private db: AngularFirestoreDocument;
  private dbSupport: AngularFirestoreCollection;
  private dbTiers: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    const { db } = environment;
    const { version, name, support, tiers } = db;
    this.db = this.afs.collection(version).doc(name);
    this.dbSupport = this.db.collection(support);
    this.dbTiers = this.db.collection<TierInterface[]>(tiers);
  }

  async writeMessage(message: Message) {
    try {
      await this.dbSupport.add(message);
    } catch (err) {
      throw err;
    }
  }

  async getTiers(): Promise<TierInterface[]> {
    try {
      const data = await this.dbTiers.get().toPromise();
      return data.docs.map(t => t.data() as TierInterface);
    } catch (err) {
      throw err;
    }
  }

  async getLocation() {
    try {
      const location = await (await fetch('https://freegeoip.app/json/')).json();
      return location.country_code;
    } catch (err) {
      throw err;
    }
  }

  async getExchangeRate(symbol: string) {
    try {
      const rate = await (await fetch(`https://api.exchangerate.host/latest?base=INR&symbols=${symbol}`)).json();
      return rate.rates[symbol];
    } catch (err) {
      throw err;
    }
  }

}
