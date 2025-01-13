import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'skill_link';

  constructor(private primeng: PrimeNG) {}
  // constructor(private primeng: PrimeNG) {
  //   this.primeng.theme.set({
  //       preset: Aura,
  //           options: {
  //               cssLayer: {
  //                   name: 'primeng',
  //                   order: 'tailwind-base, primeng, tailwind-utilities'
  //               }
  //           }
  //       })
  //   }

  ngOnInit() {
      this.primeng.ripple.set(true);
  }
}


