/**
 * Represents a Cupping Session entity in the system.
 */
export class CuppingSession {
  /** Unique identifier for the cupping session */
  id: number;

  /** Name of the cupping session */
  nombre: string;

  /** Date of the session (yyyy-mm-dd) */
  fecha: string;

  /** Origin of the coffee being cupped */
  origen: string;

  /** Variety of the coffee being cupped */
  variedad: string;

  /** Indicates whether this session is marked as favorite */
  favorito: boolean;

  /** (Optional) Name of the coffee lot associated with the session */
  loteNombre?: string;

  /** (Optional) Name of the profile associated with the session */
  perfilNombre?: string;

  /**
   * Creates a new CuppingSession instance.
   * @param session - Initial session properties
   */
  constructor(session: {
    id?: number,
    nombre?: string,
    fecha?: string,
    origen?: string,
    variedad?: string,
    favorito?: boolean,
    loteNombre?: string,
    perfilNombre?: string
  }) {
    this.id = session.id || 0;
    this.nombre = session.nombre || '';
    this.fecha = session.fecha || '';
    this.origen = session.origen || '';
    this.variedad = session.variedad || '';
    this.favorito = session.favorito || false;
    this.loteNombre = session.loteNombre;
    this.perfilNombre = session.perfilNombre;
  }
}
