import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { ToastController } from '@ionic/angular';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-reporte-supervisor',
  templateUrl: './reporte-supervisor.page.html',
  styleUrls: ['./reporte-supervisor.page.scss'],
  standalone: false,
})
export class ReporteSupervisorPage implements OnInit {
  estaciones: any[] = [];
  estacionSeleccionada: string = '';
  descripcion: string = '';
  cargando: boolean = false;
  photo: string | null = null; // URL pública de la imagen
  imagenUrl: string | null = null; // URL pública para guardar en el reporte
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // Instancia de Supabase
  private supabase: SupabaseClient;

  constructor(
    private estacionesService: EstacionesServiceService,
    private reportesService: ReportesService,
    private toastCtrl: ToastController,
    private router: Router,
    private authService: AuthServiceService
  ) {
    // Inicializa tu cliente Supabase
    this.supabase = createClient(
      'https://ypucwjnulpdbifwgyzhn.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdWN3am51bHBkYmlmd2d5emhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjY5MDMsImV4cCI6MjA2MzQ0MjkwM30.fBrI7fC2bmGXW3yXmQV-dp6krxCMS1bmOcWqk4Gxod8'
    );
  }

  ngOnInit() {
    this.estacionesService.getBaseUrlInfo().subscribe({
      next: (data) => this.estaciones = data,
      error: () => this.estaciones = []
    });
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    if (image.base64String) {
      const fileName = `reporte-${Date.now()}.jpg`;
      const blob = this.base64ToBlob(image.base64String, 'image/jpeg');

      // Sube la imagen a Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('reportes')
        .upload(fileName, blob);

      if (error) {
        await this.mostrarToast('Error al subir la imagen: ' + error.message);
        return;
      }

      // Obtén el enlace público de la imagen
      const { data: publicData } = this.supabase.storage
        .from('reportes')
        .getPublicUrl(fileName);

      if (!publicData || !publicData.publicUrl) {
        await this.mostrarToast('No se pudo obtener el enlace público de la imagen.');
        return;
      }

      this.photo = publicData.publicUrl;
      this.imagenUrl = publicData.publicUrl;
      await this.mostrarToast('Imagen subida correctamente');
    }
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  async enviarReporte() {
    if (!this.estacionSeleccionada || !this.descripcion.trim()) {
      this.mostrarToast('Debes seleccionar una estación y escribir una descripción.');
      return;
    }
    this.cargando = true;

    const userData = await this.authService.getDecryptedUserData();
    const usuarioActual = userData?.user || '';
    let imagenUrl: string | null = null;

    // Si hay imagen seleccionada, súbela a Supabase Storage
    if (this.selectedFile) {
      try {
        const safeFileName = this.selectedFile.name.replace(/\s+/g, '_');
        const fileName = `${usuarioActual}_${Date.now()}_${safeFileName}`;
        const { data, error } = await this.supabase.storage
          .from('reportes')
          .upload(fileName, this.selectedFile);

        if (error) {
          this.cargando = false;
          await this.mostrarToast('Error al subir la imagen: ' + error.message);
          return;
        }

        // Obtén el enlace público de la imagen
        const { data: publicData } = this.supabase.storage
          .from('reportes')
          .getPublicUrl(fileName);

        if (!publicData || !publicData.publicUrl) {
          this.cargando = false;
          await this.mostrarToast('No se pudo obtener el enlace público de la imagen.');
          return;
        }

        imagenUrl = publicData.publicUrl;
      } catch (e: any) {
        this.cargando = false;
        await this.mostrarToast('Error inesperado al subir la imagen');
        return;
      }
    }

    // Envía el reporte (con o sin imagen)
    this.reportesService.enviarReporte({
      usuario: usuarioActual,
      estacion: this.estacionSeleccionada,
      descripcion: this.descripcion,
      imagenUrl: imagenUrl ?? ''
    }).subscribe({
      next: async () => {
        this.cargando = false;
        await this.mostrarToast('Reporte enviado correctamente');
        this.router.navigate(['/home']);
      },
      error: async () => {
        this.cargando = false;
        await this.mostrarToast('Error al enviar el reporte');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}
