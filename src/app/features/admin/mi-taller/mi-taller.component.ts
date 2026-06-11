import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService } from '../../../core/services/taller.service';
import { AuthService } from '../../../core/services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-mi-taller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 sm:p-8 space-y-6">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-black tracking-tighter text-slate-800">Perfil de Mi Taller</h1>
          <p class="text-slate-500 font-medium mt-1 text-sm">Gestiona la información pública y ubicación de tu negocio</p>
        </div>
        
        <!-- Tarjeta de Puntaje Destacada -->
        <div class="bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 rounded-2xl shadow-lg shadow-orange-500/30">
            <div class="bg-white rounded-[15px] px-6 py-3 flex items-center gap-3">
                <div class="bg-orange-100 p-2 rounded-xl text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reputación</p>
                    <p class="text-2xl font-black text-slate-800 leading-none">{{ taller()?.puntaje || 0 }} <span class="text-sm font-bold text-slate-400">pts</span></p>
                </div>
            </div>
        </div>
      </div>

      <div *ngIf="cargando()" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!cargando() && taller()" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Formulario de Datos -->
        <div class="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
              <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-primary-500"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
                Información General
              </h2>

              <form (ngSubmit)="guardarCambios()" class="space-y-5">
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Nombre del Taller</label>
                  <input type="text" [(ngModel)]="formData.nombre" name="nombre" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" placeholder="Ej. Taller Los Hermanos">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Teléfono de Contacto</label>
                  <input type="text" [(ngModel)]="formData.telefono" name="telefono" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" placeholder="Ej. +591 77712345">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Dirección Escrita</label>
                  <textarea [(ngModel)]="formData.direccion" name="direccion" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors resize-none" placeholder="Ej. Av. Banzer 4to Anillo"></textarea>
                </div>
              </form>
          </div>

          <div class="pt-6 mt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" (click)="cargarDatos()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button type="button" (click)="guardarCambios()" [disabled]="guardando()" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2 disabled:opacity-70">
                <span *ngIf="!guardando()">Guardar Cambios</span>
                <div *ngIf="guardando()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </button>
          </div>
          
          <div *ngIf="mensajeExito()" class="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2 mt-4 animate-fade-in-up">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ¡Datos actualizados correctamente!
          </div>
        </div>

        <!-- Ubicación GPS (Mapa Interactivo) -->
        <div class="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-red-500"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                Coordenadas GPS
              </h2>
              <button (click)="obtenerGPSActual()" class="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors flex items-center gap-1.5">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                 Usar mi GPS actual
              </button>
          </div>
          
          <div class="flex-grow flex flex-col relative w-full rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner min-h-[300px]">
             <!-- Div del Mapa -->
             <div id="map" class="w-full h-full absolute inset-0 z-0"></div>
          </div>
          
          <div class="flex items-center gap-2 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
             <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
               Ubicación seleccionada: {{ formData.latitud.toFixed(6) }}, {{ formData.longitud.toFixed(6) }}
             </p>
          </div>
          <p class="text-[11px] text-slate-400 mt-2 font-medium">Puedes arrastrar el marcador en el mapa o hacer clic en otra ubicación para actualizarla.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
  `]
})
export class MiTallerComponent implements OnInit, AfterViewInit, OnDestroy {
  authService = inject(AuthService);
  tallerService = inject(TallerService);

  private map?: L.Map;
  private marker?: L.Marker;

  taller = signal<any>(null);
  cargando = signal<boolean>(true);
  guardando = signal<boolean>(false);
  mensajeExito = signal<boolean>(false);

  formData = {
    nombre: '',
    direccion: '',
    telefono: '',
    latitud: -17.7833, // Default SCZ
    longitud: -63.1821
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit() {
    // Si carga muy rapido, puede que AfterViewInit dispare antes de que ngOnInit quite 'cargando()'.
    // Esperamos a que los datos estén cargados para iniciar el mapa
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    if (this.map) return; // ya inicializado

    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    // Inicializar mapa
    this.map = L.map('map', {
      center: [this.formData.latitud, this.formData.longitud],
      zoom: 15
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.formData.latitud, this.formData.longitud], { draggable: true }).addTo(this.map);
    
    this.marker.on('dragend', () => {
      const position = this.marker!.getLatLng();
      this.formData.latitud = position.lat;
      this.formData.longitud = position.lng;
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker!.setLatLng(e.latlng);
      this.formData.latitud = e.latlng.lat;
      this.formData.longitud = e.latlng.lng;
    });

    // Timeout hack para que Leaflet renderice bien cuando el div padre hace resize o ngIf
    setTimeout(() => {
        this.map?.invalidateSize();
    }, 200);
  }

  cargarDatos() {
    this.cargando.set(true);
    const tallerId = this.authService.currentUser()?.tallerId;
    
    if (tallerId) {
      this.tallerService.obtener(tallerId).subscribe({
        next: (data) => {
          this.taller.set(data);
          this.formData = {
            nombre: data.nombre || '',
            direccion: data.direccion || '',
            telefono: data.telefono || '',
            latitud: data.latitud ? Number(data.latitud) : -17.7833,
            longitud: data.longitud ? Number(data.longitud) : -63.1821
          };
          this.cargando.set(false);

          // Inicializar mapa después de que el DOM tiene el ngIf en falso
          setTimeout(() => {
            this.initMap();
            if (this.map && this.marker) {
               this.map.setView([this.formData.latitud, this.formData.longitud], 15);
               this.marker.setLatLng([this.formData.latitud, this.formData.longitud]);
            }
          }, 100);
        },
        error: (err) => {
          console.error('Error al cargar taller', err);
          this.cargando.set(false);
        }
      });
    } else {
      this.cargando.set(false);
    }
  }

  guardarCambios() {
    if (!this.formData.nombre || !this.formData.direccion) return;

    this.guardando.set(true);
    this.mensajeExito.set(false);
    
    const tallerId = this.authService.currentUser()?.tallerId;
    
    const datos = {
        ...this.formData,
        latitud: Number(this.formData.latitud),
        longitud: Number(this.formData.longitud)
    };

    this.tallerService.actualizar(tallerId, datos).subscribe({
      next: (res) => {
        this.taller.set(res);
        this.guardando.set(false);
        this.mensajeExito.set(true);
        setTimeout(() => this.mensajeExito.set(false), 3000);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.guardando.set(false);
      }
    });
  }

  obtenerGPSActual() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.formData.latitud = position.coords.latitude;
          this.formData.longitud = position.coords.longitude;
          
          if (this.map && this.marker) {
            this.map.setView([this.formData.latitud, this.formData.longitud], 16);
            this.marker.setLatLng([this.formData.latitud, this.formData.longitud]);
          }
        }, 
        (error) => {
          alert("No se pudo obtener la ubicación. Verifica los permisos de tu navegador.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  }
}
