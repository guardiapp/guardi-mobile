import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const vigilantGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyectar el Router para redirigir
  const userType = localStorage.getItem('type'); // Obtener el tipo de usuario desde localStorage

  if (userType !== 'Resident') {
    return true; // Permitir acceso si el usuario es "Resident"
  } else {
    router.navigate(['/tabs']); // Redirigir a una página de acceso denegado
    return false; // Restringir acceso
  }
};
