import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  input,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { Guard } from 'src/app/core/models/auth.state.interface';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-guard-card',
  templateUrl: './guard-card.component.html',
  styleUrls: ['./guard-card.component.scss'],
})
export class GuardAccordionComponent {
  // @Input() guard!: Guard | null;
  public guard = input.required<Guard>();

  private platform = inject(Platform);
  private toastService = inject(ToastService);

  public isGuardInfoOpen = signal(false);
  public isCalling = signal(false);

  /**
   * The `toggleGuardInfo` function toggles the visibility of the guard information accordion.
   */
  toggleGuardInfo() {
    this.isGuardInfoOpen.set(!this.isGuardInfoOpen());
  }

  /**
   * The `callGuard` function initiates a phone call to the guard.
   * It uses the native phone dialer on mobile devices or opens a tel: link on web.
   */
  callGuard() {
    if (!this.guard().phone) {
      this.toastService.error(
        'No hay número de teléfono disponible para el guardia',
        3000
      );
      return;
    }

    this.isCalling.set(true);
    const phoneNumber = this.guard().phone;

    try {
      if (this.platform.is('hybrid')) {
        // En dispositivos móviles, usar el esquema tel: para abrir el marcador
        window.open(`tel:${phoneNumber}`, '_system');
      } else {
        // En web, mostrar un mensaje informativo
        this.toastService.info(
          'En dispositivos móviles, este botón abrirá el marcador telefónico',
          3000
        );
      }
    } catch (error) {
      this.toastService.error('Error al intentar realizar la llamada', 3000);
    } finally {
      this.isCalling.set(false);
    }
  }

  /**
   * The `copyToClipboard` function copies the specified text to the clipboard.
   * @param text - The text to copy to clipboard
   * @param label - The label of the copied data for user feedback
   */
  async copyToClipboard(text: string, label: string) {
    if (!text) {
      this.toastService.error(
        `No hay ${label.toLowerCase()} disponible para copiar`,
        2000
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.toastService.success(`${label} copiado al portapapeles`, 2000);
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.toastService.success(`${label} copiado al portapapeles`, 2000);
      } catch (fallbackError) {
        this.toastService.error(`Error al copiar ${label.toLowerCase()}`, 2000);
      }
    }
  }
}
