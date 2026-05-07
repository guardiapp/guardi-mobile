import {
  Component,
  forwardRef,
  input,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor/control-value-accessor.directive';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [DropdownModule, ReactiveFormsModule, IonicModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {
  // @Input() options!: any[];
  // @Input() placeholder: string = '';
  // @Input() label: string = '';
  options = input<any>([]);
  placeholder = input<string>('');
  label = input<string>('');
  virtualScroll = input(false);
  virtualScrollItemSize = input();
}
