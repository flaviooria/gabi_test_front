export interface WorkerTemplate {
    nombre: string;
    email: string;
    telefono?: string | null;
    direccion?: string | null;
    password: string;
    dni: string;
    services_id: number[];
    disponibilidad: { dia: number; horas: (string | null)[] }[];
    bio?: string;
    active?: boolean;
  }