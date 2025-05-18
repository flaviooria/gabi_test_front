import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { ClientTemplate } from '../../interfaces/clientTemplate.interface';

@Component({
  selector: 'customer-edit-profile-page',
  standalone: false,
  templateUrl: './edit-profile-page.component.html',
})
export class EditProfilePageComponent implements OnInit {
  public clientForm: FormGroup;
  public client?: Client;
  public isLoading: boolean = true;
  public selectedFile: File | null = null;
  public profilePhotoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private alertService: AlertService,
    private router: Router,
    private fileUploadService: FileUploadService
  ) {
    this.clientForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(255)]],
      profile_photo: [null],
    });
  }

  ngOnInit(): void {
    this.loadClientData();
  }

  loadClientData(): void {
    const userId = localStorage.getItem('token');
    if (!userId) {
      this.router.navigate(['/customer']);
      return;
    }
    this.clientService
      .getClienteById(userId)
      .pipe(delay(800))
      .subscribe((response) => {
        this.isLoading = false;
        if (!response.client) {
          this.router.navigate(['/customer']);
          return;
        }
        const client = response.client;
        this.client = client;
        this.clientForm.patchValue({
          nombre: client.user.nombre || '',
          email: client.user.email || '',
          telefono: client.user.telefono || '',
          direccion: client.user.direccion || '',
          profile_photo: client.user.profile_photo || null,
        });
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.clientForm.patchValue({ profile_photo: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    console.log(this.selectedFile);

    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe({
        next: (url) => {
          this.profilePhotoUrl = url;
          this.sendClientData(url);
        },
        error: (err) => {
          this.alertService.error('Error al subir la foto: ' + (err.message || 'Error desconocido'));
        },
      });
    } else {
      this.sendClientData(this.clientForm.value.profile_photo ?? null);
    }
  }

  private sendClientData(profilePhotoUrl: string | null): void {
    const clientData: ClientTemplate = {
      nombre: this.clientForm.value.nombre ?? '',
      email: this.clientForm.value.email ?? '',
      telefono: this.clientForm.value.telefono ?? null,
      direccion: this.clientForm.value.direccion ?? null,
      profile_photo: profilePhotoUrl,
    };

    if (!this.client?.id) {
      this.alertService.error('No se pudo identificar al cliente');
      return;
    }

    this.clientService.updateCliente(clientData).subscribe({
      next: (client) => {
        console.log(client);
        this.alertService.success(`${client.user.nombre} actualizado!`);
        // this.router.navigate(['/customer/profile']);
      },
      error: (err) => {
        this.alertService.error(err.error.message || 'Error desconocido');
      },
    });
  }

  openChangePasswordModal(): void {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  isValidField(field: string): boolean {
    const control = this.clientForm.get(field);
    return !!control?.errors && control.touched;
  }

  getFieldError(field: string): string | null {
    const control = this.clientForm.get(field);
    if (!control?.errors) return null;

    const errors = control.errors;
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'maxlength':
          return `Máximo ${errors[key].requiredLength} caracteres`;
        case 'email':
          return 'Correo electrónico inválido';
      }
    }
    return null;
  }
}