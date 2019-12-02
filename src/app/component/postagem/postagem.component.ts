import { Component, OnInit, Input } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-postagem',
  templateUrl: './postagem.component.html',
  styleUrls: ['./postagem.component.css']
})
export class PostagemComponent implements OnInit {
  @Input() postagem: any;

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
  public post_image = ['https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg', 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg', 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg', 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg', 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg', 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg', 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/post1.jpg',]
  constructor() { }

  ngOnInit() {
  }


}
