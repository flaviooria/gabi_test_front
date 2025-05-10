import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, delay, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ServicesTypes } from '../../../servicio/interfaces/servicesTypes.interface';
import { ServicioService } from '../../../servicio/services/servicio.service';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../interfaces/worker.interface';
import { WorkerTemplate } from '../../interfaces/workertemplate.interface';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'worker-new-worker-page',
  standalone: false,
  templateUrl: './new-worker-page.component.html',
  styles: ``
})
export class NewWorkerPageComponent implements OnInit {
  public workerForm: FormGroup;
  public newService: FormControl = new FormControl('');
  public existingServices: ServicesTypes[] = [];
  public showServiceInput: boolean = false;
  public serviceSearchActive: boolean = false;

  // Esto es para rellenar el horario del trabajador nuevo
  public daysOfWeek = [
    { name: 'Lunes', index: 0 },
    { name: 'Martes', index: 1 },
    { name: 'Miércoles', index: 2 },
    { name: 'Jueves', index: 3 },
    { name: 'Viernes', index: 4 },
    { name: 'Sábado', index: 5 },
    { name: 'Domingo', index: 6 }
  ];


  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private workerService: WorkerService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.workerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(255)]],
      password: ['', [
        Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/)]
      ],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      services_id: this.fb.array([], Validators.required),
      bio: ['', Validators.required],
      weeklyAvailability: this.fb.array(
        this.daysOfWeek.map(() => this.fb.group({
          morningStart: [''],
          morningEnd: [''],
          afternoonStart: [''],
          afternoonEnd: ['']
        }))
      ),
      active: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.rellenarServicesSelect();

    this.newService.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(value => {
          if (!value) {
            this.rellenarServicesSelect();
            return [];
          }
          return this.servicioService.servicesTypes;
        })
      )
      .subscribe(services => {
        this.existingServices = services.filter(s => s.name.toLowerCase().includes(this.newService.value.toLowerCase())) || [];
      });
  }

  // Relleno el select para evitar confusion
  rellenarServicesSelect() {
    this.servicioService.servicesTypes
    .pipe(delay(800))
    .subscribe(services => {
      this.existingServices = services;
    });
  }

  get services(): FormArray {
    return this.workerForm.get('services_id') as FormArray;
  }

  get weeklyAvailability(): FormArray {
    return this.workerForm.get('weeklyAvailability') as FormArray;
  }

  getFormControl(dayIndex: number, field: string): FormControl {
    const dayGroup = this.weeklyAvailability.at(dayIndex) as FormGroup;
    return dayGroup.get(field) as FormControl;
  }

  // Esto es porque el mi array guardo los ids, no los tipos completos
  getServiceName(serviceId: number): string {
    const service = this.existingServices.find(s => s.id === serviceId);
    return service ? service.name : 'Cargando...';
  }

  toggleServiceInput(): void {
    this.showServiceInput = !this.showServiceInput;
    this.serviceSearchActive = this.showServiceInput;
    if (this.showServiceInput) {
      setTimeout(() => document.getElementById('serviceInput')?.focus(), 0);
    }
  }

  onAddService(service?: ServicesTypes): void {
    if (!service && !this.newService.value) return;

    const serviceValue = service ? service : this.existingServices.find(s => s.name.toLowerCase() === this.newService.value.toLowerCase());

    if (serviceValue) {
      const exists = this.services.controls.some(control => control.value === serviceValue.id);
      if (!exists) {
        this.services.push(this.fb.control(serviceValue.id));
      }
    }

    this.newService.reset();
    this.rellenarServicesSelect();
    this.showServiceInput = false;
    this.serviceSearchActive = false;
  }

  onRemoveService(index: number): void {
    this.services.removeAt(index);
  }

  get currentWorker(): WorkerTemplate {
    const horarioRelleno = this.rellenarHorario();
    const worker: WorkerTemplate = {
      nombre: this.workerForm.value.nombre ?? '',
      email: this.workerForm.value.email ?? '',
      telefono: this.workerForm.value.telefono || null,
      direccion: this.workerForm.value.direccion || null,
      password: this.workerForm.value.password ?? '',
      dni: this.workerForm.value.dni ?? '',
      services_id: this.workerForm.value.services_id ?? [],
      disponibilidad: horarioRelleno,
      bio: this.workerForm.value.bio || null,
      active: this.workerForm.value.active ?? false
    };
    return worker;
  }


  // Para que el usuario no indique cada día del mes, solo debe introducir su horario semanal 
  rellenarHorario() {
    const weeklyAvailability = this.weeklyAvailability.value;
    const disponibilidad: { dia: number; horas: (string | null)[] }[] = [];

    // Obtengo el mes actual
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Calcular días en el mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Obtengo el primer día del mes
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Ajustar a nuestro daysOfWeek
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Le resto 1 porque getDay me devuelve contando desde Lunes = 1 (jueves = 4)

    for (let dia = 1; dia <= daysInMonth; dia++) {
      // Calcular el día de la semana para este día del mes
      const dayOfWeekIndex = (firstDayIndex + (dia - 1)) % 7;
      const daySchedule = weeklyAvailability[dayOfWeekIndex];
  
      const horas: (string | null)[] = [];
  
      // Por la mañana
      if (daySchedule.morningStart && daySchedule.morningEnd) {
        const morningRange = `${daySchedule.morningStart}-${daySchedule.morningEnd}`;
        horas.push(morningRange);
      } else {
        horas.push(null);
      }
  
      // Por la tarde
      if (daySchedule.afternoonStart && daySchedule.afternoonEnd) {
        const afternoonRange = `${daySchedule.afternoonStart}-${daySchedule.afternoonEnd}`;
        horas.push(afternoonRange);
      } else {
        horas.push(null);
      }
  
      disponibilidad.push({ dia, horas });
    }

    return disponibilidad;
  }

  /* TODO
  Distintas formas de pago
  pago en efectivo
  recibo en pdf


  ubicacion plugin de google


  formatear bien la documentación
  que se vea todo bonitoooo
  */

  onSubmit(): void {
    if (this.workerForm.invalid) {
      this.workerForm.markAllAsTouched();
      return;
    }

    this.workerService.createWorker(this.currentWorker)
    .subscribe({
      next: (worker) => {
        if (worker.id) {
          this.alertService.success(`${worker.user.nombre} creado!`);
          this.router.navigate(['/helpers']);
          this.workerForm.reset();
          (this.workerForm.controls['services_id'] as FormArray) = this.fb.array([]);
          (this.workerForm.controls['weeklyAvailability'] as FormArray) = this.fb.array(
            this.daysOfWeek.map(() => this.fb.group({
              morningStart: [''],
              morningEnd: [''],
              afternoonStart: [''],
              afternoonEnd: ['']
            }))
          );
        } else {
          this.alertService.error('Error al crear trabajador');
        }
      },
      error: (err) => {
        this.alertService.error('Error al crear trabajador');
      }
    });
  }

  isValidField(field: string): boolean {
    const control = this.workerForm.get(field);
    return !!control?.errors && control.touched;
  }

  getFieldError(field: string): string | null {
    const control = this.workerForm.get(field);
    if (!control?.errors) return null;

    const errors = control.errors;
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors[key].requiredLength} caracteres`;
        case 'maxlength':
          return `Máximo ${errors[key].requiredLength} caracteres`;
        case 'email':
          return 'Correo electrónico inválido';
        case 'pattern':
          return field === 'dni' ? 'DNI debe tener 8 dígitos y una letra' : 'Contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, un número y un carácter especial (@, $, !, %, *, #, ?, &, -)'
      }
    }
    return null;
  }
}