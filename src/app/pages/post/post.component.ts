import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

import { LoadingBarService } from "@ngx-loading-bar/core";
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
  constructor(private formBuilder: FormBuilder, public loadingBar: LoadingBarService, public api: ApiService, public rota: Router, public toach: ToastrService) {
    api.user.subscribe(res => {
      this.uid = res.uid
    });
  }
  public config: SwiperOptions = {
    slidesPerView: 1, // Slides Visible in Single View Default is 1
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
      post_loc: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      post_text: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],

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
    this.api.uploadFoto(this.fotoThumb, this.api.firebaseUser.uid, Math.random().toString(36).slice(-10) + '.png').then(res => {

      this.post_image.push(res)
      this.retirarFotoThumb()
      this.toach.success('Upload feito com sucesso', 'Upload de FOTO')
      this.loadingBar.complete()
    }, err => {
      this.toach.error('Falha no upload de foto', 'Upload de FOTO')
      this.loadingBar.complete()
    })
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
    this.loadingBar.start()
    if (this.post_image.length) {
      var obj = this.form.value;
      obj['user_id'] = this.api.usuario._id
      obj['post_image'] = this.post_image
      if (this.form.valid) {
        this.api.postData('posts', obj).subscribe(res => {
          this.loadingBar.complete()
          this.rota.navigate(['/'])
        })
      } else {
        this.toach.error('Preencha os campos', 'ERROR')
      }
    } else {
      this.toach.error('Faça upload de fotos', 'ERROR')
    }
    this.loadingBar.complete()
  }

  enviarFormServidor(tmp) {
    //  console.log(tmp)
    this.loadingBar.start()
    if (this.form.valid) {
      this.api.postData('posts', tmp).subscribe(res => {
        console.log(res)
        this.loadingBar.complete()

        this.rota.navigate(['/'])

      })
    }
  }
}
