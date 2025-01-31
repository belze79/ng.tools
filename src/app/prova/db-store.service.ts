import { Injectable } from '@angular/core';
import { concatMap, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbStoreService {

  readonly dbName : string = 'ProvaDatabase'
  readonly version : number = 1
  readonly objStore1 : string = 'store1'

  constructor() { }

  handleRequest<T>(request : IDBRequest<any>) : Observable<T>{
    return new Observable<T>(observer => {
      request.onsuccess = () => {
        console.log('handle request success: ', request.result)
        observer.next(request.result as T)
        observer.complete()
      }
      request.onerror = () => {
        console.log('failed handle request: ', request.error)
        observer.error(request.error)
      }
    })
  }

  connectDatabase() : Observable<IDBDatabase>{
    const request = indexedDB.open(this.dbName, this.version)
    return this.handleRequest<IDBDatabase>(request)
  }

  disconnectDatabase(db : IDBDatabase) : void{
    db.close()
  }

  createUpdateDatabase(version : number) : void{
    const request = indexedDB.open(this.dbName, version)
    request.onupgradeneeded = () => {
      const db : IDBDatabase = request.result
      if(!db.objectStoreNames.contains(this.objStore1)){
        db.createObjectStore(this.objStore1, {keyPath : 'key'})
      }
    }
    request.onsuccess = () => {
      console.log('database creato o aggiornato')
      const db = request.result
      db.close()
    }
    request.onerror = () => {
      console.log('erore apertura database', request.error)
    }
  }

  resetDatabase(version : number){
    const request : IDBOpenDBRequest = indexedDB.deleteDatabase(this.dbName)
    request.onsuccess = () => {
      console.log('database eliminato')
      this.createUpdateDatabase(version)
    }
    request.onerror = () => console.log('errore delete database:  ', request.error)
    request.onblocked = () => console.log('delete bloccato: ', request.error)
  }

  transactionStore(db : IDBDatabase, storeName : string, mode : IDBTransactionMode){
    const transaction = db.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    return {transaction, store}
  }

  transactionResult(db : IDBDatabase, transaction : IDBTransaction, methodType : string) : void{
    transaction.oncomplete = () => {
      console.log(`transazione ${methodType} completata`)
      this.disconnectDatabase(db)
    }
    transaction.onerror = () => {
          console.log(`transazione ${methodType} fallita`)
          this.disconnectDatabase(db)
        }
    transaction.onabort = () => {
          console.log(`transazione ${methodType} abortita`)
          this.disconnectDatabase(db)
        }
  }

  getData<T>(storeName : string, key : string) : Observable<T | undefined>{
    return this.connectDatabase().pipe(
      switchMap(db => {
          const {transaction, store} = this.transactionStore(db, storeName, 'readonly')
          const request = store.get(key)
          this.transactionResult(db, transaction, 'get data')
          return this.handleRequest<T | undefined>(request)
        })
    )
  }

  addData<T>(storeName : string, value : T) : Observable<IDBValidKey>{
    return this.connectDatabase().pipe(
      switchMap(db => {
          const {transaction, store} = this.transactionStore(db, storeName, 'readwrite')
          const request = store.add(value)
          this.transactionResult(db, transaction, 'add data')
          return this.handleRequest<IDBValidKey>(request)
      })
    )
  }

  
}
