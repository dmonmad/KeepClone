import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { nota } from 'src/modelo/nota';
import { NotasService } from 'src/app/servicio/notas.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  notapop: nota;
  goBack: number = 0;

  constructor(private notaService: NotasService, private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.notapop = this.navParams.get('notapop');
  }

  closePopover() {
    this.popoverController.dismiss(this.goBack);
  }

  borrarNota(ev) {
    console.log(this.notapop);
    if (this.notapop) {
      console.log("entra 1");
      this.notaService.borraNota(this.notapop.id);
      this.goBack = 1;
      this.closePopover();
    }
  }

  duplicarNota(ev) {
    if (this.notapop) {
      console.log("entra 2");
      let newnota: nota = {
        titulo: this.notapop.titulo,
        descripcion: this.notapop.descripcion,
        color: '#b5e0ff',
        imagenes: this.notapop.imagenes,
        usuarios: []

      }
      this.notaService.agregaNota(newnota);
      this.closePopover();
    }
  }

}
