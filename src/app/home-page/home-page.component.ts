import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { CarCardComponent } from '../car-card/car-card.component';


@Component({
  selector: 'app-home-page',
  imports: [CommonModule,CarCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
 


}
