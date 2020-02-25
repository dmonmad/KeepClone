import { Component, ViewChild } from '@angular/core';
import { NotasService } from '../servicio/notas.service';
import { nota } from 'src/modelo/nota';
import { Router } from '@angular/router';
import { UiService } from '../servicio/ui.service';
import { AuthService } from '../servicio/auth.service';
import { LoginType } from '../../modelo/user';
import { PopoverController, ActionSheetController, Platform } from '@ionic/angular';
import { PopoverPage } from '../utils/popover/popover.page';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  timer: any;
  datos: Array<nota>;
  datosfiltrados: Array<nota>;

  modoLista : boolean = true;

  userImage: string;

  isSearchBarOpened: boolean = false;

  textoBusqueda: string;

  public slideOpts = {
    setWrapperSize: true,
    slidesPerView: 1,
    initialSlide: 1
  };

  constructor(private service: NotasService,
    private ui: UiService,
    private router: Router,
    private authSvc: AuthService,
    private popoverController: PopoverController,
    private actionsheetCtrl: ActionSheetController) {
    this.datos = [];
    this.datosfiltrados = [];
    this.userImage = this.returnImage();
  }

  ionViewDidEnter() {
    this.silentRecargar();
    console.log(this.authSvc.isLogged);
  }

  alternarSearchbar() {
    this.isSearchBarOpened = !this.isSearchBarOpened;
  }

  async recargar(): Promise<void> {
    this.datos = [];
    console.log("Hasta aqui");
    let howmany : number = 10;
    await this.ui.showLoading("Cargando...");
    try {
      this.service.leerNotasPorUsuario(this.authSvc.getId(), 0, howmany)
        .subscribe(
          resultado => {
            console.log("CARGADO");
            resultado.forEach((cadaDocumento: firebase.firestore.DocumentData) => {
              let docId: string = cadaDocumento.id;
              console.log(cadaDocumento);
              let info: nota = cadaDocumento.data();
              //... = RECORRER Y AÑADIR AUTO
              let midato: nota = { id: docId, ...info };
              console.log(midato);
              this.datos.push(midato);
            })
            this.cargarDatosAFiltro();
            this.ui.hideLoad();
          },
          err => {
            console.log(err);
            this.ui.presentToast("Hubo un error recuperando los datos", 5000, "red");
            this.ui.hideLoad();
          })
    } catch (err) {
      console.log(err);
    }
  }

  async silentRecargar(): Promise<void> {
    this.datos = [];
    console.log("Hasta aqui");
    let howmany : number = 10;
    try {
      this.service.leerNotasPorUsuario(this.authSvc.getId(), 0, howmany)
        .subscribe(
          resultado => {
            console.log("CARGADO");
            resultado.forEach((cadaDocumento: firebase.firestore.DocumentData) => {
              let docId: string = cadaDocumento.id;
              console.log(cadaDocumento);
              let info: nota = cadaDocumento.data();
              //... = RECORRER Y AÑADIR AUTO
              let midato: nota = { id: docId, ...info };
              console.log(midato);
              this.datos.push(midato);
            })
            this.cargarDatosAFiltro();
          },
          err => {
            console.log(err);
            this.ui.presentToast("Hubo un error recuperando los datos", 5000, "red");
          })
    } catch (err) {
      console.log(err);
    }
  }

  async loadMore(ev): Promise<void> {
    
    console.log("Cargando mas datos");
    let howmany : number = 10;
    try {
      this.service.leerNotasPorUsuario(this.authSvc.getId(), 1, howmany)
        .subscribe(
          resultado => {
            console.log("CARGADO");
            if(resultado.docs.length < howmany){
              ev.target.disabled = true;
            }
            resultado.forEach((cadaDocumento: firebase.firestore.DocumentData) => {
              let docId: string = cadaDocumento.id;
              console.log(cadaDocumento);
              let info: nota = cadaDocumento.data();
              //... = RECORRER Y AÑADIR AUTO
              let midato: nota = { id: docId, ...info };
              console.log(midato);
              this.datos.push(midato);
            })
            this.cargarDatosAFiltro();
            ev.target.complete();
            console.log("Cargando mas datos");
          },
          err => {
            console.log(err);
            ev.target.complete();
            this.ui.presentToast("Hubo un error recuperando los datos", 5000, "red");
          })
    } catch (err) {
      console.log(err);
      ev.target.complete();
    }
    console.log("Datos cargados");
  }

  


  public doRefresh(e: any) {
    console.log("Cargando notas");
    this.recargar()
      .then(() => {
        e.target.complete();
      });
  }

  async addNote() {
    let data : nota = {
      "titulo" : "",
      "descripcion" : "",
      "color" :"",
      "imagenes" : [],
      "usuarios" : [this.authSvc.getId()]
    }
    await this.ui.showModal(data)
      .then((returnedData) => {
        console.log(returnedData)
        if (returnedData.data) {
          let notamodificada: nota = returnedData.data;
          console.log("AGREGANDO DESDE TAB1");
          console.log(notamodificada);
          this.service.agregaNota(notamodificada);
          this.silentRecargar();
        }
      });
  }

  public borraNota(id: string) {
    this.service.borraNota(id).then((salida) => {
      this.silentRecargar();
      console.log("Borrando");

    }).catch((err) => {
      console.log(err);
    })
  }

  async editarNota(item: nota) {
    console.log(item);

    await this.ui.showModal(item)
      .then((returnedData) => {
        console.log(returnedData)
        if (returnedData.data) {
          let notamodificada: nota = returnedData.data;
          console.log(notamodificada);
          this.service.actualizaNota(returnedData.data.id, notamodificada)
          this.silentRecargar();
        }
      });

  }

  async addImageToNota(item: nota, ev: Event) {
    ev.stopPropagation();

    // IMAGE PICKER NO NATIVO AQUI PARA SUBIR FOTOS PORQUE SOLO SE ACCEDE DESDE PC
    let actionSheet = await this.actionsheetCtrl.create({
      header: 'Desde... ',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'la cámara',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.anadirImagenNotaFromCamera(item);
          }
        },
        {
          text: 'la galería',
          icon: 'image',
          handler: () => {
            this.anadirImagenNotaFromGallery(item);
          }
        },
      ]
    });
    await actionSheet.present();
  }

  public alternarModo() {
    this.modoLista = !this.modoLista;
  }

  async anadirImagenNotaFromCamera(item: nota) {

    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.CAMERA
    };

    Camera.getPicture(cameraOptions)
      .then((capturedDataUrl) => {
        item.imagenes.push(capturedDataUrl);
        this.service.actualizaNota(item.id, item);
      })
  }

  async anadirImagenNotaFromGallery(item: nota) {

    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };

    Camera.getPicture(cameraOptions)
      .then((capturedDataUrl) => {
        item.imagenes.push(capturedDataUrl);
        this.service.actualizaNota(item.id, item);
      })
  }

  async openPopover(dato: nota, ev: Event) {
    ev.stopPropagation();
    console.log(dato);
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      showBackdrop: false,
      componentProps: {
        notapop: dato
      }
    });
    popover.present();
    popover.onDidDismiss().then(() => {
      this.silentRecargar();
    })
  }

  async buscarNota(evt: any) {
    console.log("Entrando buscarnota");
    this.cargarDatosAFiltro();

    this.textoBusqueda = evt.srcElement.value;

    if (!this.textoBusqueda && this.textoBusqueda != "undefined") {
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

  returnImage(): string {
    if (this.authSvc.isLogged) {
      console.log(this.authSvc.logintype);
      if (this.authSvc.logintype == LoginType.EMAIL) {
        return "https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color-round-1/254000/19-512.png";
      }
      if (this.authSvc.logintype == LoginType.GOOGLE) {
        console.log(this.authSvc.isLogged.imageUrl);
        console.log(this.authSvc.isLogged);
        return this.authSvc.isLogged.imageUrl;
      }
    }
  }

  cargarDatosAFiltro(): void {
    this.datosfiltrados = this.datos;
  }

  multipleSelectionMode() {
    alert("LongPress");
    console.log("wtf---------------------------------------------------");
  }



}
