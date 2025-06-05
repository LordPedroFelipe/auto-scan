import { Injectable } from '@angular/core';

export interface Coordenadas {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  /**
   * Obtém a localização do navegador (lat/long)
   */
  obterCoordenadas(): Promise<Coordenadas | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocalização não é suportada neste navegador.');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erro ao obter localização:', error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Faz geocodificação reversa para obter cidade com base na latitude e longitude
   */
  async obterCidadePorCoordenadas(lat: number, lng: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return (
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.state ||
        null
      );
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      return null;
    }
  }

  /**
   * Atalho para retornar cidade com base na localização atual
   */
  async obterCidadeAtual(): Promise<string | null> {
    const coords = await this.obterCoordenadas();
    if (!coords) return null;
    return await this.obterCidadePorCoordenadas(coords.latitude, coords.longitude);
  }
}
