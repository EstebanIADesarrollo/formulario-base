import { Component, signal, computed, inject, effect, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Planes } from '../../services/planes';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import moment from 'moment';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './formulario.html',
  styleUrl: './formulario.scss'
})
export class Formulario {
  @ViewChild('form') form!: NgForm; // Get reference to the form

  nombre = signal('');
  apellido = signal('');
  documento = signal('');
  eps = signal('');
  acudienteUno = signal('');
  telefonoAcudienteUno = signal('');
  acudienteDos = signal('');
  telefonoAcudienteDos = signal('');
  plan = signal('');
  fechaInicial = signal(new Date());
  fechaFinal = signal(new Date());
  adicionales = signal('');

  private planesService = inject(Planes);
  opcionesPlan = this.planesService.planes;
  opcionesAdicionales = this.planesService.adicionales;

  formulario = computed(() => ({
    nombre: this.nombre(),
    apellido: this.apellido(),
    documento: this.documento(),
    eps: this.eps(),
    acudienteUno: this.acudienteUno(),
    telefonoAcudienteUno: this.telefonoAcudienteUno(),
    acudienteDos: this.acudienteDos(),
    telefonoAcudienteDos: this.telefonoAcudienteDos(),
    plan: this.plan(),
    fechaInicial: this.fechaInicial(),
    fechaFinal: this.fechaFinal(),
    adicionales: this.adicionales()
  }));

  mostrarMensajeValidacion = signal(false); // New signal to control message visibility

  constructor() {
    effect(() => {
      const fechaInicial = moment(this.fechaInicial());
      this.fechaFinal.set(fechaInicial.add(3, 'months').toDate());
    });
  }

  enviar(): void {
    this.mostrarMensajeValidacion.set(true); // Show validation message on submit attempt

    if (this.form.valid) {
      console.log(this.formulario());
      this.mostrarMensajeValidacion.set(false); // Hide message if form is valid
    } else {
      console.log('Formulario inválido. Por favor, complete los campos requeridos.');
    }
  }

  // Helper to check control validity for styling
  isControlInvalid(controlName: string): boolean {
    if (!this.form || !this.form.controls[controlName]) { // Add check for form and control
      return false;
    }
    const control = this.form.controls[controlName];
    return this.mostrarMensajeValidacion() && control.invalid && (control.dirty || control.touched);
  }

  isControlValid(controlName: string): boolean {
    if (!this.form || !this.form.controls[controlName]) { // Add check for form and control
      return false;
    }
    const control = this.form.controls[controlName];
    return this.mostrarMensajeValidacion() && control.valid && (control.dirty || control.touched);
  }
}
