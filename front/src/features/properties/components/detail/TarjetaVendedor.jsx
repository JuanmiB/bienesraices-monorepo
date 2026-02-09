import { Avatar } from '@shared/components';

// StarRating — inline, no archivo separado
const StarRating = ({ rating }) => {
  const filled = Math.floor(rating);
  const fraction = rating - filled;

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(i => {
        if (i < filled) {
          // Estrella llena
          return (
            <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary-500">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        }
        if (i === filled && fraction > 0) {
          // Estrella media (clip por porcentaje)
          return (
            <svg key={i} viewBox="0 0 20 20" className="w-5 h-5">
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset={`${fraction * 100}%`} stopColor="currentColor" className="text-primary-500" />
                  <stop offset={`${fraction * 100}%`} stopColor="currentColor" className="text-gray-200" />
                </linearGradient>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill="url(#half-star)"
              />
              {/* Fallback: split con dos paths superpuestos */}
              <clipPath id="half-star-clip">
                <rect x="0" y="0" width={`${fraction * 20}`} height="20" />
              </clipPath>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill="#c7d2fe"
                clipPath="url(#half-star-clip-full)"
              />
            </svg>
          );
        }
        // Estrella vacía
        return (
          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-200">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
};

const TarjetaVendedor = ({ owner }) => {
  if (!owner) return null;

  const { firstName, lastName, email, avatarUrl, phone } = owner;

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Vendedor</h3>

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Avatar
          src={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          size="lg"
        />

        {/* Info */}
        <div>
          <p className="font-semibold text-gray-800">{firstName} {lastName}</p>
          <p className="text-sm text-gray-500">{email}</p>
          {phone && <p className="text-sm text-gray-500">{phone}</p>}
        </div>
      </div>

      {/* Rating (hardcoded) */}
      <div className="mt-4 flex items-center gap-2">
        <StarRating rating={4.2} />
        <span className="font-semibold text-gray-800">4.2</span>
        <span className="text-sm text-gray-400">(23 reseñas)</span>
      </div>

      <p className="text-sm text-gray-500 mt-1">12 propiedades activas</p>
    </div>
  );
};

export default TarjetaVendedor;
