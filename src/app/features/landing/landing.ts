import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
<div class="min-h-screen flex flex-col pt-6 font-sans">
  
  <!-- NAVBAR -->
  <nav class="container mx-auto px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 rounded-full shadow-sm">
    <div class="flex items-center gap-2">
      <div class="bg-primary-500 text-white p-2 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.673 2.673 0 0 1 13.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414 1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 1 1-4.001-4.002 2.828 2.828 0 0 1 4.001 4.002Z" />
        </svg>
      </div>
      <span class="font-bold text-xl text-slate-800 tracking-tight">TallerIO</span>
    </div>

    <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
      <a href="#" class="text-primary-500 font-semibold">Inicio</a>
      <a href="#" class="hover:text-primary-500 transition-colors">Para Talleres</a>
      <a href="#" class="hover:text-primary-500 transition-colors">Cómo Funciona</a>
      <a href="#" class="hover:text-primary-500 transition-colors">Planes SaaS</a>
      <a href="#" class="hover:text-primary-500 transition-colors">Soporte Tecnico</a>
    </div>

    <div class="hidden md:flex items-center gap-4">
      <button routerLink="/login" class="btn btn-outline">Login</button>
      <button routerLink="/register" class="btn btn-primary">Registrar</button>
    </div>
  </nav>

  <!-- HERO SECTION -->
  <main class="flex-grow container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div class="max-w-xl">
      <h1 class="text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mb-6 font-sans tracking-tight">
        Digitaliza tu Taller Mecánico con TallerIO
      </h1>
      <p class="text-lg text-slate-600 mb-10 leading-relaxed font-light">
        La plataforma SaaS definitiva para gestionar tus mecánicos, optimizar tus servicios y elevar la productividad de tu negocio.
      </p>
      
      <div class="flex items-center gap-4">
        <button routerLink="/register" class="btn btn-primary px-8 py-3.5 text-lg">
          Empezar
        </button>
        <button class="btn border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 px-8 py-3.5 text-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>
          Ver Funcionamiento
        </button>
      </div>
    </div>

    <div class="relative w-full aspect-square md:aspect-auto md:h-[500px] flex justify-center items-center">
      <div class="absolute inset-0 bg-emerald-50/50 rounded-full blur-3xl transform skew-y-12"></div>
      
      <div class="relative z-10 p-8 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl skew-x-[-5deg] rotate-[2deg] transform transition-transform hover:rotate-0 hover:skew-x-0 duration-500 w-4/5 h-4/5 flex justify-center items-center flex-col gap-4">
        <div class="text-4xl font-bold text-slate-200 relative z-0 uppercase tracking-widest">TallerIO Cloud</div>
        <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" class="w-48 relative z-10 drop-shadow-xl" alt="Taller">
        
        <div class="absolute top-10 left-0 bg-white p-2 rounded-lg shadow-lg text-xs font-bold flex flex-col items-center gap-1 border border-slate-100">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-emerald-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.062.51.115.77.16m-0.77-9.34c.253-.062.51-.115.77-.16m3.47 8.65c.548.28 1.12.514 1.71.7a12.94 12.94 0 0 0 9.08 0 12.94 12.94 0 0 0-9.08-5.41a12.94 12.94 0 0 0-1.71.7m0 4.01a12.94 12.94 0 0 1-1.71-.7 12.94 12.94 0 0 1 1.71-.7m0 1.41c.253.062.51.115.77.16m-0.77-9.34c.253-.062.51-.115.77-.16m0 9.18c.253.062.51.115.77.16" />
          </svg>
          Gestión Mecánicos
        </div>
        <div class="absolute top-40 right-[-20px] bg-white p-2 rounded-lg shadow-lg text-xs font-bold flex flex-col items-center gap-1 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-primary-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.5 4.5L21.75 7.5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 7.5h5.25V12.75" />
          </svg>
          Productividad
        </div>
      </div>
    </div>
  </main>

  <!-- BENEFICIOS SECTION -->
  <section class="container mx-auto px-6 py-12">
    <h2 class="text-2xl font-bold text-slate-800 mb-8">Ventajas para tu Negocio</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/50 hover:shadow-xl transition-shadow flex flex-col items-center text-center group">
        <div class="w-24 h-24 mb-6 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <img src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" class="w-12 h-12" alt="Recepcion">
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-3">Recepción de Emergencias</h3>
        <p class="text-slate-500 text-sm leading-relaxed">Recibe solicitudes directas de conductores en apuros a través de nuestra red móvil.</p>
      </div>

      <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/50 hover:shadow-xl transition-shadow flex flex-col items-center text-center group">
        <div class="w-24 h-24 mb-6 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
           <img src="https://cdn-icons-png.flaticon.com/512/912/912318.png" class="w-12 h-12" alt="Equipo">
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-3">Control de Equipo</h3>
        <p class="text-slate-500 text-sm leading-relaxed">Asigna servicios a tus mecánicos activos y mide su desempeño en tiempo real.</p>
      </div>

      <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/50 hover:shadow-xl transition-shadow flex flex-col items-center text-center group">
        <div class="w-24 h-24 mb-6 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
           <img src="https://cdn-icons-png.flaticon.com/512/2853/2853364.png" class="w-12 h-12" alt="SaaS">
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-3">Gestión SaaS</h3>
        <p class="text-slate-500 text-sm leading-relaxed">Todo el control administrativo de tu taller en la nube, sin instalaciones complejas.</p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
    <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <div class="col-span-1 md:col-span-2">
        <div class="flex items-center gap-2 mb-4">
          <div class="bg-primary-500 text-white p-1.5 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.673 2.673 0 0 1 13.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414 1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 1 1-4.001-4.002 2.828 2.828 0 0 1 4.001 4.002Z" />
            </svg>
          </div>
          <span class="font-bold text-lg text-slate-800">TallerIO</span>
        </div>
        <p class="text-slate-500 text-sm">Empoderando a los talleres mecánicos con tecnología de vanguardia para la gestión de servicios de asistencia.</p>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-4">Servicios</h4>
        <ul class="space-y-2 text-sm text-slate-500">
          <li><a href="#" class="hover:text-primary-500">Panel Admin</a></li>
          <li><a href="#" class="hover:text-primary-500">Gestión de Mecánicos</a></li>
          <li><a href="#" class="hover:text-primary-500">API para Talleres</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-4">Soporte</h4>
        <ul class="space-y-2 text-sm text-slate-500">
          <li><a href="#" class="hover:text-primary-500">Centro de ayuda</a></li>
          <li><a href="#" class="hover:text-primary-500">Documentación</a></li>
          <li><a href="#" class="hover:text-primary-500">Contacto</a></li>
        </ul>
      </div>
    </div>

    <div class="container mx-auto px-6 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div>Soporte Taller: soporte@tallerio.com | Tel: +34 123 458 789</div>
      <div>© 2026 TallerIO SaaS. Platform for Workshop Owners.</div>
      <div class="flex gap-4">
        <a href="#" class="hover:text-slate-800">Linked In</a>
        <a href="#" class="hover:text-slate-800">Twitter</a>
      </div>
    </div>
  </footer>

</div>
  `,
  styles: ``,
})
export class Landing {}
