import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  form: FormGroup;
  imageChangedEventThumb: any = '';
  @ViewChild("cropthumb", { static: false }) imageCropper: ImageCropperComponent;
  day = moment();
  mes = moment().add(1, 'months');
  fotoThumb: String;
  fotoThumbAplicado: boolean = false;
  imagemPerfil: any = "/assets/img500x.png";
  valorMenor: Number = 0;
  uid: String;
  descont: Number = 0;
  constructor(private formBuilder: FormBuilder, public api: ApiService, public rota: Router) {
    api.user.subscribe(res => {
      this.uid = res.uid
    });
  }
  public config: SwiperOptions = {
    slidesPerView: 3, // Slides Visible in Single View Default is 1
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    loop: true,
    autoHeight: true,
  };
  public post_image = []


  ngOnInit() {
    moment.locale('pt-br')
    this.form = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      about: ["", [Validators.required, Validators.minLength(2)]]
    })
  }


  fileChangeEventThumb(event: any): void {
    this.imageChangedEventThumb = event;
  }
  onFileChange(event: ImageCroppedEvent) {
    if (event.base64) {
      this.fotoThumb = event.base64;
    }
  }
  removeThumb() {
    this.fotoThumbAplicado = false;
    this.fotoThumb = null;
  }

  aplicarFotoThumb() {
    this.fotoThumbAplicado = true;
  }
  retirarFotoThumb() {
    this.fotoThumbAplicado = false;
    this.fotoThumb = null;
    this.imageChangedEventThumb = null;
  }
  rotateLeft(e) {
    e.preventDefault();
    this.imageCropper.rotateLeft();
  }
  rotateRight(e) {
    e.preventDefault();
    this.imageCropper.rotateRight();
  }
  flipHorizontal(e) {
    e.preventDefault();
    this.imageCropper.flipHorizontal();
  }
  flipVertical(e) {
    e.preventDefault();
    this.imageCropper.flipVertical();
  }

  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
  async salvar() {
    var tmp = this.form.value
    tmp.descont = this.descont
    if (!tmp.thumbnail && this.fotoThumb && tmp.title) {
      this.api.uploadFoto(this.fotoThumb, this.uid, tmp.title).then(ress => {
        tmp.thumbnail = ress;
        this.form.get('thumbnail').setValue(ress);
        this.enviarFormServidor(tmp)
      })
    } else {
      if (!this.form.valid) {
        return
      } else {
        if (tmp.thumbnail) {
          this.enviarFormServidor(tmp)
        }
      }
    }
  }

  enviarFormServidor(tmp) {
    //  console.log(tmp)
    if (this.form.valid) {
      this.api.postData('posts', tmp).subscribe(res => {
        console.log(res)
        this.rota.navigate(['/'])
      })
    }
  }
}
