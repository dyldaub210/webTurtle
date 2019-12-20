import { AuthService } from './auth.service';
import { Trade } from './../models/trade';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map,switchMap } from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class TradesService {
  trades$:Observable<Trade[]>;
  tradesDocument: AngularFirestoreDocument<Trade[]>;
  tradesCollection: AngularFirestoreCollection<Trade>;




  constructor(
    public afs:AngularFirestore,
    private auth: AuthService){
        }
  

  addTrade(trade:Trade){
    console.log(trade);
    this.tradesCollection.add(trade);
  }
  deleteItem(item: Trade,user){
    this.tradesDocument = this.afs.doc(`Users/${user.uid}/Entries/${item.id}`);
    this.tradesDocument.delete();
  }

  retrieveTrades(user){
    //Creates Observable of trades
    this.tradesCollection = this.afs.collection(`Users/${user.uid}/Entries`);
    
    this.trades$ = this.tradesCollection.snapshotChanges().pipe(map(changes =>{
      return changes.map(a=>{
      const data = a.payload.doc.data() as Trade;
      data.id = a.payload.doc.id;
      return data;
      })
    }))
    return this.trades$;
  }
  calcStopLoss(
    amount:number,
    entry:number,
    risk:number,
    type:boolean){
      let stopLoss:number;
      if (type === true) {
        stopLoss = ((amount-risk)/amount*entry);
      }
      else if(type === false) {
        stopLoss = ((amount+risk)/(amount/entry));
      }
      return stopLoss;
  }

}

