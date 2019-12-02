import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public dados = []
  constructor(public api: ApiService) {
    this.api.getData('posts').subscribe(res => {
      this.dados = res
    })
  }

  ngOnInit() {
  }

}
