import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<div class="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans py-12">
  
  <div class="absolute top-0 left-0 w-full h-full opacity-40">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
  </div>

  <div class="w-full max-w-2xl px-6 relative z-10 transition-all duration-500" [ngClass]="{'scale-95 opacity-50': loading()}">
    
    <div class="flex justify-center mb-6">
      <a routerLink="/" class="flex items-center gap-2 group flex-col">
        <div class="bg-primary-500 text-white p-2 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.673 2.673 0 0 1 13.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414 1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 1 1-4.001-4.002 2.828 2.828 0 0 1 4.001 4.002Z" />
          </svg>
        </div>
        <span class="font-bold text-xl text-slate-800 tracking-tight mt-2">TallerIO Register</span>
      </a>
    </div>

    <div class="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Registra tu Taller</h2>
        <p class="text-slate-500 text-sm">Crea tu cuenta de administrador y gestiona tu taller.</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <!-- Datos del Administrador -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-full">
            <h3 class="text-sm font-bold uppercase tracking-widest text-primary-600 mb-4 flex items-center gap-2">
              <span class="w-6 h-px bg-primary-600"></span> Propietario
            </h3>
          </div>
          <div class="form-group">
            <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1">Nombre</label>
            <input type="text" formControlName="nombre" class="form-input-custom" placeholder="Ej: Juan Perez">
          </div>
          <div class="form-group">
            <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1">Email</label>
            <input type="email" formControlName="correo" class="form-input-custom" placeholder="juan@gmail.com">
          </div>
          <div class="form-group">
            <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1">Contraseña</label>
            <input type="password" formControlName="password" class="form-input-custom" placeholder="••••••••">
          </div>
          <div class="form-group">
            <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1">Teléfono</label>
            <input type="text" formControlName="telefono" class="form-input-custom" placeholder="+591 ...">
          </div>
        </div>

        <!-- Datos del Taller -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div class="col-span-full">
            <h3 class="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
              <span class="w-6 h-px bg-blue-600"></span> Información Taller
            </h3>
          </div>
          <div class="col-span-full form-group">
            <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1">Nombre Comercial</label>
            <input type="text" formControlName="taller_nombre" class="form-input-custom" placeholder="Ej: Taller Central">
          </div>
          <div class="col-span-full form-group">
            <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1">Dirección Exacta</label>
            <input type="text" formControlName="taller_direccion" class="form-input-custom" placeholder="Av. Principal #123">
          </div>

          <!-- MAPA INTERACTIVO -->
          <div class="col-span-full">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-slate-700 text-sm font-semibold ml-1">Ubicación en el Mapa</label>
              <button type="button" (click)="getCurrentLocation()" class="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Usar mi GPS actual
              </button>
            </div>
            
            <div id="map" class="w-full h-64 rounded-2xl border-2 border-slate-200 shadow-inner z-0 overflow-hidden"></div>
            
            <div class="flex items-center gap-2 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
               <div class="w-2 h-2 rounded-full" [ngClass]="locationCaptured() ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'"></div>
               <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                 <span *ngIf="!locationCaptured()">Selecciona un punto en el mapa</span>
                 <span *ngIf="locationCaptured()" class="text-emerald-600">Coordenadas: {{ lat().toFixed(6) }}, {{ lng().toFixed(6) }}</span>
               </p>
            </div>
          </div>

        </div>

        <div class="pt-6">
          <button type="submit" [disabled]="registerForm.invalid || loading() || !locationCaptured()" class="w-full btn-primary py-4 rounded-2xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!loading()">Registrar Taller</span>
            <span *ngIf="loading()">Procesando...</span>
          </button>
        </div>
      </form>

    </div>
  </div>
</div>
  `,
  styles: [`
    .form-input-custom {
      @apply w-full bg-slate-50 border-slate-200 text-slate-900 px-4 py-3.5 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-slate-300;
    }
  `]
})
export class Register implements AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private map?: L.Map;
  private marker?: L.Marker;

  loading = signal(false);
  locationCaptured = signal(false);
  lat = signal<number>(0);
  lng = signal<number>(0);

  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telefono: [''],
    taller_nombre: ['', Validators.required],
    taller_direccion: ['', Validators.required],
  });

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    // Definir iconos por defecto (Bug Leaflet con Webpack/Vite)
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
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

    // Inicializar mapa en una ubicación neutra (ej: Centro de la ciudad o 0,0)
    // Usaremos -17.7833, -63.1821 (Santa Cruz, Bolivia) como ejemplo inicial
    this.map = L.map('map', {
      center: [-17.7833, -63.1821],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  private updateMarker(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map!);
      this.marker.on('dragend', () => {
        const position = this.marker!.getLatLng();
        this.updateCoordinates(position.lat, position.lng);
      });
    }
    this.updateCoordinates(lat, lng);
  }

  private updateCoordinates(lat: number, lng: number) {
    this.lat.set(lat);
    this.lng.set(lng);
    this.locationCaptured.set(true);
  }

  getCurrentLocation() {
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updateMarker(lat, lng);
          if (this.map) {
            this.map.setView([lat, lng], 16);
            // Pequeño hack para asegurar que el mapa se renderice bien si hubo saltos
            setTimeout(() => this.map?.invalidateSize(), 100);
          }
        },
        (error) => {
          let msg = 'Error desconocido al obtener GPS';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              msg = 'Permiso denegado por el usuario. Por favor activa el GPS en el candado de la barra de direcciones.';
              break;
            case error.POSITION_UNAVAILABLE:
              msg = 'La ubicación no está disponible actualmente.';
              break;
            case error.TIMEOUT:
              msg = 'Se agotó el tiempo de espera para obtener la ubicación.';
              break;
          }
          alert(msg);
          console.error('Geolocation Error:', error);
        },
        options
      );
    } else {
      alert('Tu navegador no soporta Geolocation.');
    }
  }

  onSubmit() {
    if (this.registerForm.invalid || !this.locationCaptured()) return;

    this.loading.set(true);
    const formVal = this.registerForm.value;

    const payload = {
      nombre: formVal.nombre,
      correo: formVal.correo,
      password: formVal.password,
      telefono: formVal.telefono,
      taller: {
        nombre: formVal.taller_nombre,
        direccion: formVal.taller_direccion,
        telefono: formVal.telefono || '', 
        latitud: this.lat(),
        longitud: this.lng()
      }
    };

    this.authService.registerAdmin(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/admin/dashboard']);
        this.loading.set(false);
      },
      error: (err) => {
        alert(err.error?.detail || 'Error al registrar');
        this.loading.set(false);
      }
    });
  }
}
