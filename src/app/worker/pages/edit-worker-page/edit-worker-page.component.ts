import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, delay, switchMap } from 'rxjs';
import { ServicesTypes } from '../../../servicio/interfaces/servicesTypes.interface';
import { ServicioService } from '../../../servicio/services/servicio.service';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../interfaces/worker.interface';
import { AlertService } from '../../../shared/services/alert.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { WorkerTemplate } from '../../interfaces/workertemplate.interface';

@Component({
  selector: 'worker-edit-worker-page',
  standalone: false,
  templateUrl: './edit-worker-page.component.html',
  styles: ``,
})
export class EditWorkerPageComponent implements OnInit {
  public workerForm: FormGroup;
  public newService: FormControl = new FormControl('');
  public existingServices: ServicesTypes[] = [];
  public showServiceInput: boolean = false;
  public serviceSearchActive: boolean = false;
  public worker?: Worker;
  public isLoading: boolean = true;
  public selectedFile: File | null = null;
  public profilePhotoUrl: string | null = null; // Para almacenar la URL de la foto

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private workerService: WorkerService,
    private alertService: AlertService,
    private router: Router,
    private fileUploadService: FileUploadService // Inyecta el servicio
  ) {
    this.workerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(255)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      services_id: this.fb.array([], Validators.required),
      bio: ['', Validators.required],
      profile_photo: [null], // Ahora será una URL (string), no un archivo
      active: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.rellenarServicesSelect();
    this.loadWorkerData();

    this.newService.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((value) => {
          if (!value) {
            this.rellenarServicesSelect();
            return [];
          }
          return this.servicioService.servicesTypes;
        })
      )
      .subscribe((services) => {
        this.existingServices =
          services.filter((s) => s.name.toLowerCase().includes(this.newService.value.toLowerCase())) || [];
      });
  }

  loadWorkerData(): void {
    const userId = localStorage.getItem('token');
    if (!userId) {
      this.router.navigate(['/helper']);
      return;
    }
    this.workerService
      .getWorkerById(userId)
      .pipe(delay(800))
      .subscribe((response) => {
        this.isLoading = false;
        if (!response.worker) {
          this.router.navigate(['/helper']);
          return;
        }
        const worker = response.worker;
        this.worker = worker;
        this.workerForm.patchValue({
          nombre: worker.user.nombre || '',
          email: worker.user.email || '',
          telefono: worker.user.telefono || '',
          direccion: worker.user.direccion || '',
          dni: worker.dni || '',
          bio: worker.bio || '',
          active: worker.active,
          profile_photo: worker.user.profile_photo || null, // Carga la URL existente
        });

        const services = JSON.parse(worker.services_id);
        services.forEach((serviceId: number) => {
          (this.workerForm.get('services_id') as FormArray).push(this.fb.control(serviceId));
        });
      });
  }

  rellenarServicesSelect() {
    this.servicioService.servicesTypes.pipe(delay(800)).subscribe((services) => {
      this.existingServices = services;
    });
  }

  get services(): FormArray {
    return this.workerForm.get('services_id') as FormArray;
  }

  getServiceName(serviceId: number): string {
    const service = this.existingServices.find((s) => s.id === serviceId);
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

    const serviceValue = service
      ? service
      : this.existingServices.find((s) => s.name.toLowerCase() === this.newService.value.toLowerCase());

    if (serviceValue) {
      const exists = this.services.controls.some((control) => control.value === serviceValue.id);
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

  openChangePasswordModal(): void {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  // Esto es porque angula no actualiza automáticamente los File
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.workerForm.patchValue({ profile_photo: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.workerForm.invalid) {
      this.workerForm.markAllAsTouched();
      return;
    }

    // Si hay un archivo seleccionado, súbelo primero
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe({
        next: (url) => {
          this.profilePhotoUrl = url;
          this.sendWorkerData(url); // Envía los datos después de subir la foto
        },
        error: (err) => {
          this.alertService.error('Error al subir la foto: ' + (err.message || 'Error desconocido'));
        },
      });
    } else {
      // Si no hay archivo, envía los datos directamente con la URL existente o null
      this.sendWorkerData(this.workerForm.value.profile_photo ?? null);
    }
  }

  private sendWorkerData(profilePhotoUrl: string | null): void {
    const workerData: WorkerTemplate = {
      nombre: this.workerForm.value.nombre ?? '',
      email: this.workerForm.value.email ?? '',
      telefono: this.workerForm.value.telefono ?? '',
      direccion: this.workerForm.value.direccion ?? '',
      dni: this.workerForm.value.dni ?? '',
      services_id: this.workerForm.value.services_id ?? [],
      bio: this.workerForm.value.bio ?? '',
      active: this.workerForm.value.active,
      profile_photo: profilePhotoUrl, // Envía la URL de la foto
    };

    this.workerService.updateWorkerProfile(workerData).subscribe({
      next: (worker) => {
        this.alertService.success(`${worker.user.nombre} actualizado!`);
        this.router.navigate(['/helper/profile']);
      },
      error: (err) => {
        this.alertService.error(err.error.message || 'Error desconocido');
      },
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
          return field === 'dni' ? 'DNI debe tener 8 dígitos y una letra' : 'Formato inválido';
      }
    }
    return null;
  }
}