import { Component, Input } from '@angular/core';
import { AuthState } from 'src/app/core/models/auth.state.interface';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserInfoCardComponent {
  @Input() auth!: AuthState;
}
