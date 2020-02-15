import { Injectable } from '@angular/core';
import { FirebaseFirestore } from '@angular/fire';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { nota } from 'src/modelo/nota';


@Injectable({
  providedIn: 'root'
})
export class NotasService {

  conexionColeccion:AngularFirestoreCollection<any>;

  constructor(private bbdd:AngularFirestore) {

    this.conexionColeccion = this.bbdd.collection(environment.bbdd);

   }


  // leerTodas():Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>{
  //   return this.conexionColeccion.get();

  // }

  agregaNota(datos):Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    return this.conexionColeccion.add(datos);
  }



 leeNota(id) : Observable<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
   return this.conexionColeccion.doc(id).get();
 }

leerTodas2(timer:number=5000):Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>{
  return new Observable((observer)=>{
    //observer.next()   observer.error();   observer.complete();
    let subscripcion:Subscription;
    let tempo=setTimeout(()=>{
      subscripcion.unsubscribe();
      observer.error(console.log("WTFFFF"));
    },timer);
    subscripcion = this.conexionColeccion.get().subscribe( res =>{
      console.log("entrando suscripcion");
      clearTimeout(tempo);
      observer.next(res);
      observer.complete();
    },
    err =>{console.log("eeeeeeeeeeeeeeeeeeeeeeee"); observer.error(console.log("WTF"))},
    )
  });
}

actualizaNota(id, data) : Promise<void> {
  return this.conexionColeccion.doc(id).set(data);
}

borraNota(id) : Promise<void> {
  return this.conexionColeccion.doc(id).delete();
}




}
