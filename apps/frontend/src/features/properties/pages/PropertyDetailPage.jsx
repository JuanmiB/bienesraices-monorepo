import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@shared/components/layout";
import { BackButton } from "@shared/components";
import { Spinner } from "@shared/components/feedback";
import {
  GaleriaPropiedad,
  TarjetaVendedor,
  PropiedadInfo,
  PropiedadDescripcion,
  PropiedadMapa,
  PropertyContactForm
} from "../components/detail";
import { getPropertyById } from "@features/properties/services";
import { useAuth } from "@features/auth/context";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: result, isLoading: loading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: Boolean(id),
  });

  if (loading) return <Spinner fullScreen label="Cargando..." />;

  return (
    <>
      {result ? (
        <section className="flex flex-col gap-6 mx-2 my-5 customlg:mx-36 customlg:mt-10">
          {/* Botón volver */}
          <BackButton fallbackPath="/buscar" label="Volver a propiedades" />

          {/* Imagen arriba - ancho completo */}
          <GaleriaPropiedad images={result.images} />

          {/* Dos columnas debajo: info izquierda, vendedor+contacto derecha */}
          <div className={`flex flex-col ${
            user?.id !== result.owner?.id
              ? 'customlg:grid customlg:grid-cols-[2fr_1fr] customlg:gap-6'
              : ''
          }`}>
            {/* Columna izquierda - Info de la propiedad */}
            <div className="flex flex-col gap-4">
              <PropiedadInfo
                title={result.title}
                price={result.price}
                currency={result.currency}
                address={result.address}
                bedrooms={result.bedrooms}
                bathrooms={result.bathrooms}
                garages={result.garages}
                totalArea={result.totalArea}
              />
              <PropiedadDescripcion descripcion={result.description} />
              <PropiedadMapa lat={result.latitude} lng={result.longitude} />
            </div>

            {/* Columna derecha - Vendedor y formulario (solo si no es el dueño) */}
            {user?.id !== result.owner?.id && (
              <div className="flex flex-col gap-4 mt-4 customlg:mt-0">
                <TarjetaVendedor owner={result.owner} />
                <PropertyContactForm propertyId={id} />
              </div>
            )}
          </div>
        </section>
      ) : (
        <p>No hay resultado</p>
      )}
      <Footer />
    </>
  );
};

export default PropertyDetailPage;
