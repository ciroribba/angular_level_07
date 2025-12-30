import { Component, ElementRef, signal, viewChild, AfterViewInit } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { DecimalPipe, JsonPipe,  } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}
@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe, DecimalPipe],
  templateUrl: './markers-page.html',
})
export class MarkersPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-122.40985, 37.793085], // starting position [lng, lat]
      zoom: 14,
    });

    // const marker = new mapboxgl.Marker({
    //   color: 'red',
    //   draggable: false,
    // })
    //   .setLngLat([-122.40985, 37.793085])
    //   .addTo(map);

    // marker.on('dragend', (event) => {
    //   const lngLat = event.target.getLngLat();
    //   console.log(lngLat);
    // });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    

    map.on('click', (event) => this.mapClick(event));

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;

    const map = this.map()!;

    const coord = event.lngLat;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    
    const mapboxMarker = new mapboxgl.Marker({
      color: color,
      draggable: false,
    })
      .setLngLat(coord)
      .addTo(map);

    const newMarker = { id: uuidv4(), mapboxMarker };
    
    this.markers.update(markers => [newMarker, ...markers.filter(marker => marker.id !== newMarker.id)]);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    const map = this.map()!;

    marker.mapboxMarker.remove();

    this.markers.set(this.markers().filter((m) => m.id !== marker.id));
    // this.markers.update(this.markers().filter((m) => m.id !== marker.id));
  }
 }
