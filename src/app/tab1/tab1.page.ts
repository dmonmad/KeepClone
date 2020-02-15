import { Component, ViewChild } from '@angular/core';
import { NotasService } from '../servicio/notas.service';
import { nota } from 'src/modelo/nota';
import { Router } from '@angular/router';
import { UiService } from '../servicio/ui.service';
import { AuthService } from '../servicio/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginType } from '../../modelo/user';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  timer: any;
  datos: Array<nota>;
  datosfiltrados: Array<nota>;

  userImage : string;

  isSearchBarOpened : boolean;

  textoBusqueda: string;

  public slideOpts = {
    setWrapperSize: true,
    slidesPerView: 1,
    initialSlide: 1
  };

  constructor(private service: NotasService,
    private ui: UiService,
    private router: Router,
    private authSvc: AuthService) {
    this.datos = [];
    this.datosfiltrados = [];
    this.userImage = this.returnImage();
  }

  ionViewDidEnter() {
    this.recargar();
    console.log(this.authSvc.isLogged);
  }

  async recargar(): Promise<void> {
    this.datos = [];
    console.log("Hasta aqui");
    await this.ui.showLoading("Cargando...");
    try {
      this.service.leerTodas2()
        .subscribe(
          resultado => {
            console.log("CARGADO");
            resultado.forEach((cadaDocumento: firebase.firestore.DocumentData) => {
              let docId: string = cadaDocumento.id;
              let info: nota = cadaDocumento.data();
              //... = RECORRER Y AÑADIR AUTO
              let midato: nota = { id: docId, ...info };
              this.datos.push(midato);
            })
            this.cargarDatosAFiltro();
            this.ui.hideLoad();
          },
          err => {
            this.ui.presentToast("Hubo un error recuperando los datos", 5000, "red");
            this.ui.hideLoad();
          })
    } catch (err) {

    }
  }


  public doRefresh(e: any) {
    console.log("Cargando notas");
    this.recargar()
      .then(() => {
        e.target.complete();
      });
  }

  public addNote(): void {
    this.router.navigateByUrl('/tabs/tab2');
  }

  public borraNota(id: string) {
    this.service.borraNota(id).then((salida) => {
      this.recargar();
      console.log("Borrando");

    }).catch((err) => {
      console.log(err);
    })
  }

  async editarNota(ide: string, tit: string, des: string) {
    let dato: nota = { id: ide, titulo: tit, descripcion: des };
    await this.ui.showModal(dato)
      .then((returnedData) => {
        console.log(returnedData)
        if (returnedData.data) {
          this.service.actualizaNota(returnedData.data.id, { titulo: returnedData.data.titulo, descripcion: returnedData.data.descripcion })
          this.recargar();
        }
      });

  }

  async buscarNota(evt : any) {
    console.log("Entrando buscarnota");
    this.cargarDatosAFiltro();

    this.textoBusqueda = evt.srcElement.value;

  if (!this.textoBusqueda && this.textoBusqueda != "undefined" ) {
    console.log(this.textoBusqueda)
    console.log("return buscarnota");
    return;
  }

  this.datosfiltrados = this.datosfiltrados.filter(item => {
    console.log("filtrando");
    if (item.titulo && item) {
      console.log("titulo && item");
      if (item.titulo.toLowerCase().indexOf(this.textoBusqueda.toLowerCase()) > -1 || item.descripcion.toLowerCase().indexOf(this.textoBusqueda.toLowerCase()) > -1) {
        console.log("Return true");
        return true;
      }
      console.log("Return false");
      return false;
    }
  });
  }

  async onLogout() {
    console.log("########## Logged out");
    await this.ui.showLoading();
    this.authSvc.onLogout()
      .then(res => {
        console.log(res);
        this.ui.hideLoad();
        this.authSvc.clearSession();
        this.router.navigateByUrl('/login');
      })
      .catch(res => {
        console.log(res);
        this.ui.hideLoad();
        this.authSvc.clearSession();
        this.ui.presentToast("Hubo un error cerrando la sesion", 5000, "red");
        this.router.navigateByUrl('/login');
      });

  }

  returnImage() : string{
    if(this.authSvc.isLogged){
      if(this.authSvc.logintype == LoginType.EMAIL){
        return "https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color-round-1/254000/19-512.png";
      }
      if(this.authSvc.logintype == LoginType.GOOGLE){
        console.log(this.authSvc.isLogged.imageUrl);
        console.log(this.authSvc.isLogged);
        return this.authSvc.isLogged.imageUrl;
      }
    }
  }

  cargarDatosAFiltro(): void {
    this.datosfiltrados = this.datos;
  }

  multipleSelectionMode(){
    alert("LongPress");
  }



}
