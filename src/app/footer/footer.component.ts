import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor (private route:ActivatedRoute) {}

  inHome:boolean = false

  ngOnInit () {
    console.log(this.route.snapshot.url[0].path)
    if (this.route.snapshot.url[0].path === "home") {
      this.inHome = true
      console.log(this.inHome)
    }
  }

}
