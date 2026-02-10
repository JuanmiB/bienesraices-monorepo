import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "@shared/components/layout";
import { BackButton } from "@shared/components";
import FormularioContacto from "../../../components/FormularioContacto/FormularioContacto";
import {
  GaleriaPropiedad,
  TarjetaVendedor,
  PropiedadInfo,
  PropiedadDescripcion,
  PropiedadMapa
} from "../components/detail";
import { api } from "@shared/services/api";
import { useAuth } from "@features/auth/context";

const PropertyDetailPage = () => {
  const [result, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/api/v1/properties/${id}`);
        setResults(response.data.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  if (loading) return <p className="text-center my-12 text-gray-500">Cargando...</p>;

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
                <FormularioContacto propertyId={id} />
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
