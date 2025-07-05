export class CuppingSession {
  id?: string;
  nombre: { name: string };
  origen: { name: string };
  variedad: { name: string };
  fecha: string | Date;
  favorito?: boolean;
  lote?: { id: string };
  perfil_tueste?: { id: string };
  procesamiento?: { name: string };
  user_id?: string;

  constructor(session: Partial<CuppingSession> = {}) {
    this.id = session.id;
    this.nombre = session.nombre ?? { name: '' };
    this.origen = session.origen ?? { name: '' };
    this.variedad = session.variedad ?? { name: '' };
    this.fecha = session.fecha ?? new Date().toISOString();
    this.favorito = session.favorito ?? false;
    this.lote = session.lote;
    this.perfil_tueste = session.perfil_tueste;
    this.procesamiento = session.procesamiento;
    this.user_id = session.user_id;
  }
}
