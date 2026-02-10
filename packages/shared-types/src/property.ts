export interface Property {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  habitaciones: number;
  estacionamiento: number;
  wc: number;
  imagen: string | null;
  categoriaId: number;
  precioId: number;
  usuarioId: string;
  lat: string | null;
  lng: string | null;
  publicado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyCreateDTO {
  titulo: string;
  descripcion: string;
  precio: number;
  habitaciones: number;
  estacionamiento: number;
  wc: number;
  categoriaId: number;
  precioId: number;
  lat?: string;
  lng?: string;
}

export interface PropertyUpdateDTO extends Partial<PropertyCreateDTO> {}

export interface PropertyFilterParams {
  categoriaId?: number;
  precioId?: number;
  habitaciones?: number;
  estacionamiento?: number;
  wc?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  property: Property;
}

export interface PropertiesListResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
