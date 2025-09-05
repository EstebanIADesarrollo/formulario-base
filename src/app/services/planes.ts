import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Planes {
  planes = [
    { plan: 'Plan Basic', precio: 70000 },
    { plan: 'Plan Advance', precio: 90000 },
    { plan: 'Plan Gold', precio: 150000 },
    { plan: 'Plan Premium', precio: 170000 }
  ];

  adicionales = [
    { nombre: 'Ninguno', precio: 0 },
    { nombre: 'Uniforme', precio: 100000 },
    { nombre: 'Ruta', precio: 120000 },
    { nombre: 'Fisioterapia', precio: 300000 }
  ];
}
