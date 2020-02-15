import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular'
import { NotasService } from '../../servicio/notas.service'
import { nota } from 'src/modelo/nota';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  public notaForm: FormGroup;

  encodeData: any;

  encodedData: any;

  generateQR : boolean = false;

  title = 'app';
  qrType = 'text';
  qrValue = 'Techiediaries';


  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    public service: NotasService) {
      
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

  public encodeText() {
    console.log("Entra");
    console.log(this.notaForm.get("title").value);
    console.log(this.notaForm.get("description").value);

    this.generateQR = !this.generateQR;
    
  }

  public getTextToQr() : string{
    return this.notaForm.get("title").value+"//break//"+this.notaForm.get("description").value;
  }

  // this.barcodeScanner
  //   .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.notaForm.get("title").value+
  //   this.notaForm.get("description").value)
  //   .then( encodedData => {
  //     console.log("Entra 2");
  //       console.log(encodedData);
  //       alert(encodedData);
  //     },
  //     err => {
  //       console.log("Error occured : " + err);
  //     }
  //   );
  // }

}
