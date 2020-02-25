import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController, PopoverController } from '@ionic/angular';
import { nota } from 'src/modelo/nota';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PopoverPage } from '../popover/popover.page';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  public notaForm: FormGroup;

  encodeData: any;

  encodedData: any;

  generateQR: boolean = false;

  title = 'app';
  qrType = 'text';
  qrValue = 'Techiediaries';


  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private actionsheetCtrl: ActionSheetController,
    private popoverController: PopoverController) {

  }

  @Input() public notamodal: nota;


  ngOnInit() {
    this.notaForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ionViewDidEnter() {
      this.notaForm.get("title").setValue(this.notamodal.titulo);
      this.notaForm.get("description").setValue(this.notamodal.descripcion);
  }

  async closeModal() {
    await this.modalController.dismiss(this.notamodal);
  }

  async addImageToNota(ev: Event) {
    ev.stopPropagation();
    let actionSheet = await this.actionsheetCtrl.create({
      header: 'Desde... ',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'la cámara',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.anadirImagenNotaFromCamera(this.notamodal);
          }
        },
        {
          text: 'la galería',
          icon: 'image',
          handler: () => {
            this.anadirImagenNotaFromGallery(this.notamodal);
          }
        },
      ]
    });
    await actionSheet.present();
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
        this.notamodal.imagenes.push(capturedDataUrl);
      })
      .catch((err) => console.log("No se ha seleccionado ninguna imagen" + err));
  }

  async anadirImagenNotaFromGallery(item: nota) {

    let imagenbase64: string;

    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    };

    Camera.getPicture(cameraOptions)
      .then((capturedDataUrl) => {
        this.notamodal.imagenes.push(capturedDataUrl);
      })
  }

  public encodeText() {
    console.log("Entra");
    console.log(this.notaForm.get("title").value);
    console.log(this.notaForm.get("description").value);

    this.generateQR = !this.generateQR;

  }

  public getTextToQr(): string {
    return this.notaForm.get("title").value + "//break//" + this.notaForm.get("description").value;
  }

  async openPopover(ev: Event) {
    ev.stopPropagation();
    console.log(this.notamodal);
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      showBackdrop: false,
      componentProps: {
        notapop: this.notamodal,
        goBack: null
      }
    });

    popover.onDidDismiss().then(res => {
      if (res.data.goBack == 1) {
        this.closeModal();
      }
    })

    popover.present();
  }

  public deletePic(foto: string) {
    const index: number = this.notamodal.imagenes.indexOf(foto);
    if (index !== -1) {
      this.notamodal.imagenes.splice(index, 1);
    }
  }

}
