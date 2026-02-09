import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?._token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No se encontró el token de autenticación.'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Añade el usuario a la solicitud
    next() // Continúa hacia el controlador
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación inválido.'
    })
  }
}
