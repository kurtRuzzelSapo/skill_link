import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu-template-demo',
  imports: [MenuModule, BadgeModule, RippleModule, AvatarModule, CommonModule],
  templateUrl: './menu-template-demo.component.html',
  styleUrl: './menu-template-demo.component.css'
})
export class MenuTemplateDemoComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus',  },
          { label: 'Search', icon: 'pi pi-search',  }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog',  },
          { label: 'Messages', icon: 'pi pi-inbox', }
        ]
      },
      { separator: true }, // Optional separator
      {
        label: '',
        items: [{ label: '', icon: '', command: () => {}, style: { height: '55vh' } }] // Spacer item
      },
      {
        label: '',
        icon: 'pi pi-sign-out',
        shortcut: '⌘+Q',
        command: () => {
          console.log('Logout clicked');
        }
      }
    ];
  }

}
