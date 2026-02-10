import { useEffect, useState } from 'react';
import { Footer } from "@shared/components/layout";
import { Search, PropiedadesDestacadas } from '../components';
import { api } from '@shared/services/api';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/v1/properties/types');
        setCategories(data.propertyTypes);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image con Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src='/assets/hero-bg.jpg'
            alt="Luxury home"
            className="w-full h-full object-cover scale-105 blur-sm"
          />
          <div className="absolute inset-0 gradient-hero" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Encuentra el hogar de tus sueños
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Explora miles de propiedades exclusivas en las mejores ubicaciones.
            Tu próximo capítulo comienza aquí.
          </p>

          {/* Search Bar */}
          <div className="mb-12 max-w-4xl mx-auto">
            <Search selectOps={categories} />
          </div>
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS */}
      <PropiedadesDestacadas />

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default HomePage;
