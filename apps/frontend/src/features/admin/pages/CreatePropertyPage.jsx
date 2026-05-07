import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProperty } from '../services';
import { useForm } from '@shared/hooks';
import { BackButton } from '@shared/components';
import { FormularioPropiedad, Dropzone } from '../components';

const CreatePropertyPage = () => {
  const [imagenes, setImagenes] = useState([]);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

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
    longitude: 0
  };

  const queryClient = useQueryClient();
  const { values, handleChange, handleSubmit, resetForm, handleLatLng, handleGeoData } = useForm(initialValues);

  const createMutation = useMutation({
    mutationFn: ({ data, images }) => createProperty(data, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      resetForm();
      setImagenes([]);
      setStatus("success");
    },
    onError: () => setStatus("error"),
  });

  const onSubmit = (data) => {
    if (imagenes.length === 0) {
      setStatus("error");
      return;
    }
    createMutation.mutate({ data, images: imagenes });
  };

  if (status === "success") {
    return (
      <section className="border border-emerald-500 p-6 my-4 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-4">¡Propiedad publicada!</h2>
          <p className="text-gray-500 mb-6">Tu propiedad ha sido creada exitosamente.</p>
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
    <>
      <section className="border border-emerald-500 p-6 my-4 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <BackButton fallbackPath="/admin/mis-propiedades" label="Volver a mis propiedades" />
        </div>
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Publicar</h2>
        {status === "error" && <p className="text-red-500 text-sm mb-4">Error al crear la propiedad. Intentá de nuevo.</p>}
        <h3 className="text-xl font-medium text-gray-700 mb-6">Información General</h3>
        <Dropzone setImagenes={setImagenes} />
        <FormularioPropiedad
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLatLng={handleLatLng}
          handleGeoData={handleGeoData}
          onSubmit={onSubmit}
          isEditable={true}
        />
      </section>
    </>
  );
};

export default CreatePropertyPage;
