import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tapaburaco';

  constructor(public api: ApiService) {}

  logOut() {
    this.api.afAuth.auth.signOut();
    this.api.setFirebaseNull();
  }
}
