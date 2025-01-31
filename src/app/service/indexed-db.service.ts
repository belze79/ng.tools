import { Injectable } from '@angular/core';
import { catchError, concatMap, filter, from, Observable, of, switchMap, tap } from 'rxjs';
import { IndexedDbKey } from '../enum/storage_http_key';

interface TransactionStore{
  transaction : IDBTransaction,
  store : IDBObjectStore
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private readonly dbName : string = IndexedDbKey.DB_NAME
  private readonly version : number = IndexedDbKey.VERSION
  private objStores : string[] = [IndexedDbKey.GAME_WORLD_DATA.toString(), 
    IndexedDbKey.PLAN_DATA.toString(), IndexedDbKey.SPY_DATA.toString()]
  readonly planData : string = 'PlanData'

  constructor() {
    this.createUpdateDatabase()
  }

  private handleRequest<T>(request : IDBRequest<any>) : Observable<T>{
    return new Observable<T>(observer => {
      request.onsuccess = () => {
        // console.log('handle request success ', request.source)
        observer.next(request.result as T)
        observer.complete()
      }
      request.onerror = () => {
        console.log('handle request fail ', request.error)
        observer.error(request.error)
      }
    })
  }

  private connectDatabase() : Observable<IDBDatabase>{
    const request = indexedDB.open(this.dbName, this.version)
    return this.handleRequest<IDBDatabase>(request)
  }

  private disconnectDatabase(db : IDBDatabase) : void{
    db.close()
  }

  private transactionStore(db : IDBDatabase, storeName : string, mode : IDBTransactionMode) : TransactionStore{
    const transaction = db.transaction(storeName,mode)
    const store = transaction.objectStore(storeName)
    return {transaction, store}
  }

  private transactionResult(db : IDBDatabase, transaction : IDBTransaction, methodType : string) : void{
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

  private createUpdateDatabase() : void{
    const request = indexedDB.open(this.dbName, this.version)
    request.onupgradeneeded = () => {
      const db : IDBDatabase = request.result

      this.objStores.forEach(storeName => {
        if(!db.objectStoreNames.contains(storeName)){
          db.createObjectStore(storeName, {keyPath : 'key'})
          console.log('creato objectstore GameData')
        }
      })
    }

    this.handleRequest<IDBDatabase>(request).subscribe({
      next : db => {
        console.log('database creato o aggiornato')
        this.disconnectDatabase(db)
      },
      error : err => {
        console.log('erore apertura database', err)
      },
      complete : () => console.log('tentativo creazione aggiornamento database completato')
    })
  }

  public resetDatabase() : void{
    
    const request : IDBOpenDBRequest = indexedDB.deleteDatabase(this.dbName)

    request.onsuccess = (e : Event) => {
      console.log('database eliminato con successo')
      this.createUpdateDatabase()
    }

    request.onerror = (e : Event) => {
      console.error('errore nell\'eliminazione del database', (e.target as IDBRequest).error)
    }

    request.onblocked = (e : Event) => {
      console.error('eliminazione database bloccata da altre connessioni')
    }
  }
  
  public deleteOldData(storeName : string){
    this.connectDatabase().pipe(
      switchMap(db => {
        const {transaction, store} = this.transactionStore(db, storeName, 'readonly')
        const request = store.getAll()
        this.transactionResult(db, transaction, 'get all')
        const today = new Date(new Date().setHours(0, 0, 0, 0))
        return this.handleRequest<{key : string, date : Date, value : any}[]>(request).pipe(
          switchMap(resp => 
            from(resp).pipe(
              // tap(noFilter => console.log('elemento controllato per eliminazione', noFilter)),
              filter(obj => obj.date < today),
              concatMap(obj => {
                console.log('eliminato gameworld ', obj.key)
                return this.deleteData(storeName, obj.key)
              }
            )
          ))
        )
      })
    ).subscribe({
      next : resp => console.log('ok get all'),
      error : err => console.log('errore get all', err.message)
    })
  }

  public getData<T>(storeName : string, key : string) : Observable<T | undefined>{
      return this.connectDatabase().pipe(
        switchMap(db => {
          const {transaction, store} = this.transactionStore(db, storeName, 'readonly')
          const request = store.get(key)
          this.transactionResult(db, transaction, 'get data')
          return this.handleRequest<T | undefined>(request)
        })
      )
  }
  
  public addData<T>(storeName : string, data : {key : string, date : Date, value : T}) : Observable<IDBValidKey>{
    return this.connectDatabase().pipe(
      switchMap(db => {
        const {transaction, store} = this.transactionStore(db, storeName, 'readwrite')
        const request = store.add(data)
        this.transactionResult(db, transaction, 'add data')
        return this.handleRequest<IDBValidKey>(request)
      })
    )
  }

  public deleteData(storeName : string, key : string) : Observable<void>{
    return this.connectDatabase().pipe(
      switchMap(db => {
        const {transaction, store} = this.transactionStore(db, storeName, 'readwrite')
        const request = store.delete(key)
        this.transactionResult(db, transaction, 'delete record')
        return this.handleRequest<void>(request)
      })
    )
  }
}
