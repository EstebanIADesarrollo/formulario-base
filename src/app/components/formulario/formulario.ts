import { Component, signal, computed, inject, effect, ViewChild, HostListener } from '@angular/core';
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
import { FormularioDataService } from '../../services/formulario-data.service'; // Importa el nuevo servicio

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
  correo = signal('');
  eps = signal('');
  acudienteUno = signal('');
  telefonoAcudienteUno = signal('');
  acudienteDos = signal('');
  telefonoAcudienteDos = signal('');
  plan = signal('');
  fechaInicial = signal(new Date());
  fechaFinal = signal(new Date());
  adicionales = signal('Ninguno');

  private planesService = inject(Planes);
  private formularioDataService = inject(FormularioDataService); // Inyecta el nuevo servicio

  opcionesPlan = this.planesService.planes;
  opcionesAdicionales = this.planesService.adicionales;

  formulario = computed(() => ({
    nombre: this.nombre(),
    apellido: this.apellido(),
    documento: this.documento(),
    correo: this.correo(),
    eps: this.eps(),
    acudienteUno: this.acudienteUno(),
    telefonoAcudienteUno: this.telefonoAcudienteUno(),
    acudienteDos: this.acudienteDos(),
    telefonoAcudienteDos: this.telefonoAcudienteDos(),
    plan: this.plan(),
    fechaInicial: moment(this.fechaInicial()).format('YYYY-MM-DD'), // Formatear fecha
    fechaFinal: moment(this.fechaFinal()).format('YYYY-MM-DD'), // Formatear fecha
    adicionales: this.adicionales()
  }));

  mostrarMensajeValidacion = signal(false); // New signal to control message visibility
  triggerAnimation = signal(false); // New signal to control animation

  constructor() {
    effect(() => {
      const fechaInicial = moment(this.fechaInicial());
      this.fechaFinal.set(fechaInicial.add(3, 'months').toDate());
    });
  }

  formSubmitted = signal(false);

  enviar(): void {
    this.formSubmitted.set(true);
    this.triggerAnimation.set(false); // Reset animation state

    if (this.form.valid) {
      console.log('Datos a enviar:', this.formulario());
      this.mostrarMensajeValidacion.set(false); // Hide message if form is valid

      this.formularioDataService.enviarFormulario(this.formulario()).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          alert('Formulario enviado con éxito!');
          this.form.resetForm(); // Resetear el formulario después del envío exitoso
          this.formSubmitted.set(false); // Reset submitted state on success
        },
        error: (error) => {
          console.error('Error al enviar el formulario:', error);
          alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
          this.formSubmitted.set(false); // Reset submitted state on error
        }
      });

    } else {
      this.mostrarMensajeValidacion.set(true); // Show validation message on submit attempt
      console.log('Formulario inválido. Por favor, complete los campos requeridos.');
      // Scroll to the top of the form if on a small screen
      if (window.innerWidth < 600) { // Assuming 600px as breakpoint for mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Trigger animation after a short delay to allow scroll to complete
        setTimeout(() => {
          this.triggerAnimation.set(true);
        }, 500); // Adjust delay as needed for scroll duration
      } else {
        this.triggerAnimation.set(true); // Trigger animation immediately on larger screens
      }
    }
  }

  // Helper methods are no longer needed with the new CSS approach
  // isControlInvalid(controlName: string): boolean { ... }
  // isControlValid(controlName: string): boolean { ... }

  /**
   * Muestra un diálogo de confirmación antes de que el usuario abandone la página
   * si el formulario tiene cambios sin guardar.
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.form.dirty) {
      $event.returnValue = true;
    }
  }
}



