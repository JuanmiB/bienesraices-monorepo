import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPropertyById, updateProperty } from '../services';
import { useForm } from '@shared/hooks';
import { BackButton } from '@shared/components';
import { Spinner } from '@shared/components/feedback';
import { FormularioPropiedad, GaleriaAdmin } from '../components';
import { useParams, useNavigate } from "react-router-dom";

const EditPropertyPage = () => {
  const [imagenes, setImagenes] = useState([]);
  const [status, setStatus] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialValues = {
    title: "",
    description: "",
    propertyType: "",
    operationType: "",
    price: "",
    currency: "USD",
    bedrooms: "",
    bathrooms: "",
    garages: "",
    totalArea: "",
    coveredArea: "",
    address: "",
    city: "",
    state: "",
    latitude: 0,
    longitude: 0,
  };

  const { values, setValues, handleChange, handleSubmit, handleLatLng, handleGeoData } = useForm(initialValues);

  const { data: property, isLoading: loading } = useQuery({
    queryKey: ['my-property', id],
    queryFn: () => getMyPropertyById(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!property) return;
    setValues({
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      operationType: property.operationType,
      price: property.price,
      currency: property.currency,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      garages: property.garages,
      totalArea: property.totalArea,
      coveredArea: property.coveredArea,
      address: property.address,
      city: property.city,
      state: property.state,
      latitude: Number(property.latitude) || 0,
      longitude: Number(property.longitude) || 0,
    });
    setImagenes(property.images || []);
  }, [property, setValues]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-property', id] });
      setStatus("success");
    },
    onError: () => setStatus("error"),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (loading) return <Spinner fullScreen label="Cargando..." />;

  if (status === "success") {
    return (
      <section className="border border-blue-500 p-6 my-4 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">¡Propiedad actualizada!</h2>
          <p className="text-gray-500 mb-6">Los cambios han sido guardados correctamente.</p>
          <button
            onClick={() => navigate("/admin/mis-propiedades")}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            Ver mis propiedades
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-blue-500 p-6 my-4 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <BackButton fallbackPath="/admin/mis-propiedades" label="Volver a mis propiedades" />
      </div>
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Editar Propiedad</h2>
      {status === "error" && <p className="text-red-500 text-sm mb-4">Error al actualizar la propiedad. Intentá de nuevo.</p>}

      <div className="mb-8">
        <GaleriaAdmin propertyId={id} images={imagenes} onImagesChange={setImagenes} />
      </div>

      <FormularioPropiedad
        values={values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleLatLng={handleLatLng}
        handleGeoData={handleGeoData}
        onSubmit={onSubmit}
        submitLabel="Guardar cambios"
      />
    </section>
  );
};

export default EditPropertyPage;
