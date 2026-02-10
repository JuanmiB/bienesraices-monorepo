/**
 * Valida formato de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que el precio sea un número positivo
 */
export const isValidPrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Valida número de habitaciones (0-10)
 */
export const isValidRooms = (rooms) => {
  const numRooms = Number(rooms);
  return Number.isInteger(numRooms) && numRooms >= 0 && numRooms <= 10;
};

/**
 * Valida número de estacionamientos (0-10)
 */
export const isValidParking = (parking) => {
  const numParking = Number(parking);
  return Number.isInteger(numParking) && numParking >= 0 && numParking <= 10;
};

/**
 * Valida número de baños (0-10)
 */
export const isValidBathrooms = (bathrooms) => {
  const numBathrooms = Number(bathrooms);
  return Number.isInteger(numBathrooms) && numBathrooms >= 0 && numBathrooms <= 10;
};

/**
 * Evalúa fortaleza de contraseña
 * @returns {'weak' | 'medium' | 'strong'}
 */
export const passwordStrength = (password) => {
  if (!password || password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return 'strong';
  }
  return 'medium';
};

/**
 * Valida longitud mínima de contraseña
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida que dos contraseñas coincidan
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida coordenadas de latitud
 */
export const isValidLatitude = (lat) => {
  const numLat = Number(lat);
  return !isNaN(numLat) && numLat >= -90 && numLat <= 90;
};

/**
 * Valida coordenadas de longitud
 */
export const isValidLongitude = (lng) => {
  const numLng = Number(lng);
  return !isNaN(numLng) && numLng >= -180 && numLng <= 180;
};
