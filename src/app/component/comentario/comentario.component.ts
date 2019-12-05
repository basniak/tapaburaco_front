import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit {
  // @Input() avatar = 'https://raw.githubusercontent.com/GuMarques/tapaburaco-api/master/JSON%20Objects/perfil1.jpg';
  @Input() comentario;
  @Input() usuario;
  @Input() usuarios = [];
  avatar = '';
  cidade = '';
  displayName = '';
  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i]._id == this.usuario) {
        this.avatar = this.usuarios[i].photoURL;
        this.cidade = this.usuarios[i].cidade;
        this.displayName = this.usuarios[i].displayName;
      }
    }
  }
}
