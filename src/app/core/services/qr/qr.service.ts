import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private apiSvc = inject(ApiService);
  private tokenService = inject(TokenService);
  private apiUrl: string = environment.apiUrl;

  constructor() {}

  async shareQRImage(
    // reservationId: number,
    url: string,
    fileName: string = 'qr_visita.png'
  ) {
    try {
      // 1. Descargar la imagen como blob
      const imageBlob = await this.downloadImageFromUrl(url);

      // 2. Guardar temporalmente el archivo
      const filePath = await this.saveTempFile(imageBlob, fileName);

      // 3. Compartir el archivo
      await Share.share({
        title: 'QR para tu visita',
        text: 'Aquí está tu código QR para acceder al apartamento',
        url: filePath,
        dialogTitle: 'Compartir código QR',
      });

      // Opcional: Limpiar archivo temporal después de compartir
      // await this.deleteTempFile(filePath);
    } catch (error) {
      console.error('Error al compartir QR:', error);
      throw error;
    }
  }

  public async downloadImage(id: number): Promise<Blob> {
    const response = await fetch(`${this.apiUrl}visits/${id}/getQrImage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.tokenService.getToken()}`,
      },
    });
    if (!response.ok) throw new Error('No se pudo descargar la imagen');
    return await response.blob();
  }

  /**
   * Descarga una imagen desde una URL proporcionada.
   * @param url URL completa de la imagen a descargar
   */
  public async downloadImageFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.tokenService.getToken()}`,
      },
    });
    if (!response.ok) throw new Error('No se pudo descargar la imagen');
    return await response.blob();
  }

  private async saveTempFile(blob: Blob, fileName: string): Promise<string> {
    const base64Data = await this.blobToBase64(blob);

    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache,
      recursive: true,
    });

    return result.uri;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Error al convertir blob a base64'));
        }
      };
      reader.readAsDataURL(blob);
    });
  }

  private async deleteTempFile(filePath: string): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: filePath,
      });
    } catch (cleanError) {
      console.warn('No se pudo eliminar el archivo temporal:', cleanError);
    }
  }
}
