import { Injectable } from '@angular/core';
import { FirebaseFirestore } from '@angular/fire';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { nota } from 'src/modelo/nota';
import { firestore } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class NotasService {

  conexionColeccion: AngularFirestoreCollection<nota>;

  private nextQueryAfter: QueryDocumentSnapshot<nota>;

  constructor(private bbdd: AngularFirestore) {


  }


  // leerTodas():Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>{
  //   return this.conexionColeccion.get();

  // }

  agregaNota(datos): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    this.conexionColeccion = this.bbdd.collection(environment.bbdd);
    return this.conexionColeccion.add(datos);
  }



  leeNota(id): Observable<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    this.conexionColeccion = this.bbdd.collection(environment.bbdd);
    return this.conexionColeccion.doc(id).get();
  }

  leerNotasPorUsuario(user: string, loadmore: number, howmany: number): Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    console.log(user);
    if (loadmore == 0) {
      this.nextQueryAfter = null;
    }

    this.conexionColeccion = this.getCollectionQuery(user, howmany);
    return new Observable((observer) => {
      //observer.next()   observer.error();   observer.complete();
      let subscripcion: Subscription;
      let tempo = setTimeout(() => {
        subscripcion.unsubscribe();
        console.log("aaaaaaaaaaaaaaaaaaaaaa"); 
      }, 5000);
      subscripcion = this.conexionColeccion.get().subscribe(res => {
        console.log("entrando suscripcion");

        this.nextQueryAfter = res.docs[res.docs.length - 1] as QueryDocumentSnapshot<nota>;


        clearTimeout(tempo);
        observer.next(res);
        observer.complete();
      },
        err => { 
          console.log("eeeeeeeeeeeeeeeeeeeeeeee"); 
          observer.error(console.log(err)) },
      )
    });
  }

  private getCollectionQuery(user: string, howmany : number): AngularFirestoreCollection<nota> {
    if (this.nextQueryAfter) {
      return this.conexionColeccion = this.bbdd.collection(environment.bbdd, ref =>
        ref.where('usuarios', 'array-contains', user)
          .orderBy('titulo', 'desc')
          .startAfter(this.nextQueryAfter)
          .limit(howmany));
    } else {
      return this.conexionColeccion = this.bbdd.collection(environment.bbdd, ref =>
        ref.where('usuarios', 'array-contains', user)
          .orderBy('titulo', 'desc')
          .limit(howmany));
    }
  }

  leerTodas2(timer: number = 5000): Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    this.conexionColeccion = this.bbdd.collection(environment.bbdd);
    return new Observable((observer) => {
      //observer.next()   observer.error();   observer.complete();
      let subscripcion: Subscription;
      let tempo = setTimeout(() => {
        subscripcion.unsubscribe();
        observer.error(console.log("WTFFFF"));
      }, timer);
      subscripcion = this.conexionColeccion.get().subscribe(res => {
        console.log("entrando suscripcion");
        clearTimeout(tempo);
        observer.next(res);
        observer.complete();
      },
        err => { console.log("eeeeeeeeeeeeeeeeeeeeeeee"); observer.error(console.log("WTF")) },
      )
    });
  }

  actualizaNota(id, data: nota): Promise<void> {
    this.conexionColeccion = this.bbdd.collection(environment.bbdd);
    return this.conexionColeccion.doc(id).set(data);
  }

  borraNota(id): Promise<void> {
    this.conexionColeccion = this.bbdd.collection(environment.bbdd);
    return this.conexionColeccion.doc(id).delete();
  }




}
