import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit {
  @Input() avatar = 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/perfil1.jpg';
  @Input() comentario;
  constructor() { }

  ngOnInit() {
  }

}
