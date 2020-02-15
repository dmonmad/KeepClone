import { Component } from '@angular/core';
import { NotasService } from '../servicio/notas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UiService } from '../servicio/ui.service';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { nota } from 'src/modelo/nota';
import { Router } from '@angular/router';
import { IonBackButton } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { BarcodeScanResult, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public notaForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private notasService: NotasService,
    private ui: UiService,
    private router: Router,
    private scanner: BarcodeScanner) {


  }
  scanSub: any;

  ngOnInit() {
    this.notaForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  async addNote() {
    let data: nota;
    data = {
      titulo: this.notaForm.get('title').value,
      descripcion: this.notaForm.get('description').value
    }
    await this.ui.showLoading("Cargando...");
    this.notasService.agregaNota(data)
      .then((ok) => {
        this.notaForm.reset();
        this.ui.presentToast('Nota agregada', 2000, 'success');
        this.router.navigateByUrl('/tabs/tab1');
      })
      .catch((err) => {
        this.ui.presentToast('Nota agregada', 2000, 'error');
      })
      .finally(() => {
        this.ui.hideLoad();

      })
  }

  scanCode() {
    // Optionally request the permission early
    this.scanner.scan().then(barcodeData => {
      let titledesc : string[] = barcodeData.text.split("//break//", 2);

      this.notaForm.get('title').setValue(titledesc[0]);
      this.notaForm.get('description').setValue(titledesc[1]);
     }).catch(err => {
         console.log('Error', err);
     });
    }
}
