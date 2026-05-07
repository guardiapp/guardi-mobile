import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanning',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Escaner</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="square"></div>
    </ion-content>
  `,
  styles: [
    `
      ion-content {
        --background: transparent;
      }

      .square {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
        width: 250px;
        height: 250px;
        border: 6px solid white;
        box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
      }
    `,
  ],
})
export class BarcodeScanningModalComponent implements AfterViewInit, OnDestroy {
  constructor(
    private readonly ngZone: NgZone,
    private modalController: ModalController
  ) {}

  ngAfterViewInit(): void {
    // setTimeout(() => {
    this.startScan();
    // }, 250);
  }

  ngOnDestroy(): void {
    this.stopScan().catch((error) => {
      console.error('Error stopping the scan:', error);
    });
  }

  public async closeModal(barcode?: any): Promise<void> {
    try {
      await this.modalController.dismiss({ barcode });
    } catch (error) {
      console.error('Error closing the modal:', error);
    }
  }

  private async startScan(): Promise<void> {
    try {
      document.querySelector('body')?.classList.add('barcode-scanning-active');

      const options: StartScanOptions = {
        formats: [BarcodeFormat.QrCode], // Solo escanear QR
        lensFacing: LensFacing.Back,
      };

      const listener = await BarcodeScanner.addListener(
        'barcodesScanned',
        async (event) => {
          this.ngZone.run(() => {
            if (event.barcodes.length > 0) {
              listener.remove().catch((error) => {
                console.error('Error removing the listener:', error);
              });
              this.closeModal(event.barcodes[0]?.displayValue);
            }
          });
        }
      );

      await BarcodeScanner.startScan(options);
    } catch (error) {
      console.error('Error starting the scan:', error);
    }
  }

  private async stopScan(): Promise<void> {
    try {
      document
        .querySelector('body')
        ?.classList.remove('barcode-scanning-active');
      await BarcodeScanner.stopScan();
    } catch (error) {
      console.error('Error stopping the scan:', error);
    }
  }
}
