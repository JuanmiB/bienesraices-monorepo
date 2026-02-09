import PropTypes from 'prop-types';

const typeLabels = {
    house: 'Casa',
    apartment: 'Departamento',
    land: 'Terreno',
    commercial: 'Local Comercial',
    office: 'Oficina',
    warehouse: 'Depósito'
};

const CardPropiedadDestacada = ({ propiedad, onClick }) => {
    const { title, price, currency, address, bedrooms, bathrooms, mainImageUrl, propertyType } = propiedad;

    return (
        <article
            onClick={onClick}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer
                       hover:shadow-xl transition-all duration-300 group"
        >
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={mainImageUrl || '/assets/placeholder-property.jpg'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {propertyType && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--color-primary)]
                                     text-white text-xs font-semibold rounded-full shadow-md">
                        {typeLabels[propertyType] || propertyType}
                    </span>
                )}
            </div>

            {/* Contenido */}
            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                    {title}
                </h3>
                <p className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                    {currency} {Number(price)?.toLocaleString() || '0'}
                </p>
                <p className="text-gray-500 text-sm mb-3 line-clamp-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {address || 'Ubicación no especificada'}
                </p>

                {/* Amenidades */}
                <div className="flex gap-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M0 16L3 5V1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4l3 11v5a1 1 0 0 1-1 1v2h-1v-2H2v2H1v-2a1 1 0 0 1-1-1v-5zM19 5h1V1H4v4h1V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h2V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1zm0 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V6h-2v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6H3.76L1.04 16h21.92L20.24 6H19zM1 17v4h22v-4H1zM6 4v4h4V4H6zm8 0v4h4V4h-4z"/>
                        </svg>
                        <span className="text-sm">{bedrooms || 0} Hab.</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M17.03 21H7.97a4 4 0 0 1-1.3-.22l-1.22 2.44-.9-.44 1.22-2.44a4 4 0 0 1-1.38-1.55L.5 11h7.56a4 4 0 0 1 1.78.42l2.32 1.16a4 4 0 0 0 1.78.42h9.56l-2.9 5.79a4 4 0 0 1-1.37 1.55l1.22 2.44-.9.44-1.22-2.44a4 4 0 0 1-1.3.22zM21 11h2.5a.5.5 0 1 1 0 1h-9.06a4.5 4.5 0 0 1-2-.48l-2.32-1.15A3.5 3.5 0 0 0 8.56 10H.5a.5.5 0 0 1 0-1h8.06c.7 0 1.38.16 2 .48l2.32 1.15a3.5 3.5 0 0 0 1.56.37H20V2a1 1 0 0 0-1.74-.67c.64.97.53 2.29-.32 3.14l-.35.36-3.54-3.54.35-.35a2.5 2.5 0 0 1 3.15-.32A2 2 0 0 1 21 2v9zm-5.48-9.65l2 2a1.5 1.5 0 0 0-2-2zm-10.23 17A3 3 0 0 0 7.97 20h9.06a3 3 0 0 0 2.68-1.66L21.88 14h-7.94a5 5 0 0 1-2.23-.53L9.4 12.32A3 3 0 0 0 8.06 12H2.12l3.17 6.34z"/>
                        </svg>
                        <span className="text-sm">{bathrooms || 0} Baños</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

CardPropiedadDestacada.propTypes = {
    propiedad: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        currency: PropTypes.string,
        address: PropTypes.string,
        bedrooms: PropTypes.number,
        bathrooms: PropTypes.number,
        mainImageUrl: PropTypes.string,
        propertyType: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default CardPropiedadDestacada;
