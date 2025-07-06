export class CuppingSession {
  id?: string;
  nombre: string;
  origen: string;
  variedad: string;
  fecha: string | Date;
  favorito?: boolean;
  lote?: string;
  perfil_tueste?: string;
  procesamiento?: string;
  user_id?: string;

  constructor(session: Partial<CuppingSession> = {}) {
    this.id = session.id;
    this.nombre = session.nombre ?? '';
    this.origen = session.origen ?? '';
    this.variedad = session.variedad ?? '';
    this.fecha = session.fecha ?? new Date().toISOString();
    this.favorito = session.favorito ?? false;
    this.lote = session.lote;
    this.perfil_tueste = session.perfil_tueste;
    this.procesamiento = session.procesamiento;
    this.user_id = session.user_id;
  }
}
