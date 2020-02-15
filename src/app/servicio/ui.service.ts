import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { nota } from 'src/modelo/nota';
import { ModalPage } from '../utils/modal/modal.page';
import { NotasService } from './notas.service';
import { OverlayEventDetail } from '@ionic/core';
import { myEnterAnimation } from '../animations/enter';
import { myLeaveAnimation } from '../animations/leave';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  miLoading:any;

  constructor(public loading:LoadingController,
    public modal:ModalController,
    public toast:ToastController) { }

  async showLoading(msg?:string) {
    if(this.miLoading){
      this.hideLoad();
    }
    this.miLoading = await this.loading.create({
      message: msg ? msg:''
    });
    await this.miLoading.present();
  }

  public hideLoad(){
    this.miLoading=null;
    this.loading.dismiss();
  }
  
  async showModal(dato:nota) : Promise<OverlayEventDetail<any>> {
    console.log("showmodal");
    let notadata;
    const modal = await this.modal.create({
      component: ModalPage,
      componentProps: {
        notamodal : dato
      }
    });
    console.log("present");
    modal.present();
    console.log("after present");
    await modal.onWillDismiss().then(dataReturned => {
      // trigger when about to close the modal
      console.log("recibiendo");
      console.log(dataReturned)
      notadata = dataReturned;
      
    });
    return notadata;
    
  }


  async presentToast(msg:string, dur:number=2000, col:string) : Promise<void> {
    const toast = await this.toast.create({
      
      message: msg,
      duration: dur,
      color: col,
      translucent : true,
      showCloseButton:true,
      position: "middle"      

    });
    toast.present();
  }
}
