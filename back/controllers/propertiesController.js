import { Property, PropertyImage, User } from '../models/index.js'
import { Op } from 'sequelize'
import cloudinary from '../config/cloudinary.js'
import { logger } from '../helpers/logger.js'

// ─── Helpers ─────────────────────────────────────────────────
// Escapar caracteres comodín de SQL LIKE para evitar inyección
const escapeLike = (str) => str.replace(/[%_\\]/g, '\\$&')

// ─── Includes reutilizables ──────────────────────────────────
const publicIncludes = [
  { model: PropertyImage, as: 'images' },
  { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email', 'avatarUrl', 'phone'] }
]

// ─── Datos del sistema ───────────────────────────────────────
export const getPropertyTypes = (req, res) => {
  res.status(200).json({
    success: true,
    propertyTypes: [
      { value: 'house', label: 'Casa' },
      { value: 'apartment', label: 'Departamento' },
      { value: 'land', label: 'Terreno' },
      { value: 'commercial', label: 'Local Comercial' },
      { value: 'office', label: 'Oficina' },
      { value: 'warehouse', label: 'Depósito' }
    ],
    operationTypes: [
      { value: 'sale', label: 'Venta' },
      { value: 'rent', label: 'Alquiler' },
      { value: 'temporary', label: 'Temporal' }
    ]
  })
}

// ─── Endpoints públicos ──────────────────────────────────────

// GET /api/v1/properties
// Soporta paginación y todos los filtros en un solo endpoint
// Query params: page, limit, q, propertyType, operationType, minPrice, maxPrice, city, state
export const listProperties = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 10, 100)
    const offset = (page - 1) * limit

    const { q, propertyType, operationType, minPrice, maxPrice, city, state, featured } = req.query

    const where = { active: true }
    const andConditions = []

    // Búsqueda por texto en título, descripción o dirección
    if (q) {
      const escaped = escapeLike(q)
      andConditions.push({
        [Op.or]: [
          { title: { [Op.like]: `%${escaped}%` } },
          { description: { [Op.like]: `%${escaped}%` } },
          { address: { [Op.like]: `%${escaped}%` } }
        ]
      })
    }

    // Filtros enum — solo aplican si el valor es válido
    if (propertyType && ['house', 'apartment', 'land', 'commercial', 'office', 'warehouse'].includes(propertyType)) {
      where.propertyType = propertyType
    }
    if (operationType && ['sale', 'rent', 'temporary'].includes(operationType)) {
      where.operationType = operationType
    }

    // Filtro de destacadas
    if (featured === 'true') where.featured = true

    // Filtros de precio
    if (minPrice) andConditions.push({ price: { [Op.gte]: parseFloat(minPrice) } })
    if (maxPrice) andConditions.push({ price: { [Op.lte]: parseFloat(maxPrice) } })

    // Filtros de ubicación
    if (city) andConditions.push({ city: { [Op.like]: `%${escapeLike(city)}%` } })
    if (state) andConditions.push({ state: { [Op.like]: `%${escapeLike(state)}%` } })

    if (andConditions.length > 0) {
      where[Op.and] = andConditions
    }

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: publicIncludes,
      order: [['createdAt', 'DESC']],
      distinct: true,
      limit,
      offset
    })

    const totalPages = Math.ceil(count / limit)

    res.status(200).json({
      success: true,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      data: rows
    })
  } catch (error) {
    logger.error('Error al listar propiedades', { error: error.message })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// GET /api/v1/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params

    const propiedad = await Property.findByPk(id, {
      include: publicIncludes
    })

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada'
      })
    }

    res.status(200).json({
      success: true,
      data: propiedad
    })
  } catch (error) {
    logger.error('Error al obtener propiedad', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// ─── Endpoints autenticados — propiedades del usuario ────────

// GET /api/v1/users/me/properties
export const getMyProperties = async (req, res) => {
  try {
    const { sub: userId } = req.user

    const { count, rows } = await Property.findAndCountAll({
      where: { userId },
      include: [{ model: PropertyImage, as: 'images' }],
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    res.status(200).json({
      success: true,
      total: count,
      data: rows
    })
  } catch (error) {
    logger.error('Error al obtener propiedades del usuario', { error: error.message, userId: req.user?.sub })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// Helper — subir un buffer a Cloudinary y retornar el resultado
const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'propiedades' },
    (error, result) => error ? reject(error) : resolve(result)
  )
  stream.end(buffer)
})

// POST /api/v1/users/me/properties
export const createProperty = async (req, res) => {
  try {
    const { sub: userId } = req.user

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Se requiere al menos una imagen' })
    }

    const {
      title, description, propertyType, operationType,
      price, currency = 'USD',
      totalArea, coveredArea, bedrooms, bathrooms, garages, age,
      address, city, state, postalCode, country = 'Argentina',
      latitude, longitude
    } = req.body

    // Upload todas las imágenes a Cloudinary
    const uploads = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)))

    const property = await Property.create({
      userId, title, description, propertyType, operationType,
      price, currency, totalArea, coveredArea, bedrooms, bathrooms, garages, age,
      address, city, state, postalCode, country, latitude, longitude,
      mainImageUrl: uploads[0].secure_url
    })

    // Crear registros PropertyImage — el primero es isPrimary
    await Promise.all(uploads.map((result, index) =>
      PropertyImage.create({
        propertyId: property.id,
        publicId: result.public_id,
        url: result.secure_url,
        isPrimary: index === 0,
        order: index
      })
    ))

    const propertyWithImages = await Property.findByPk(property.id, {
      include: [{ model: PropertyImage, as: 'images' }]
    })

    res.status(201).json({
      success: true,
      message: 'Propiedad creada correctamente',
      data: propertyWithImages
    })
  } catch (error) {
    logger.error('Error al crear propiedad', { error: error.message, userId: req.user?.sub })
    res.status(500).json({
      success: false,
      message: 'Error al crear la propiedad',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    })
  }
}

// GET /api/v1/users/me/properties/:id
export const getMyProperty = async (req, res) => {
  try {
    const { id } = req.params
    const { sub: userId } = req.user

    const propiedad = await Property.findByPk(id, {
      include: [{ model: PropertyImage, as: 'images' }]
    })

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    res.status(200).json({ success: true, data: propiedad })
  } catch (error) {
    logger.error('Error al obtener propiedad propia', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// PUT /api/v1/users/me/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params
    const { sub: userId } = req.user
    const { file } = req

    const propiedad = await Property.findByPk(id, {
      include: [{ model: PropertyImage, as: 'images' }]
    })

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    // Actualizar imagen si se envió una nueva
    if (file) {
      const imagenPrincipal = propiedad.images?.find(img => img.isPrimary)

      const nuevaImagen = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'propiedades' },
          (error, result) => error ? reject(error) : resolve(result)
        )
        uploadStream.end(file.buffer)
      })

      if (imagenPrincipal?.publicId) {
        await cloudinary.uploader.destroy(imagenPrincipal.publicId)
        await imagenPrincipal.destroy()
      }

      await PropertyImage.create({
        propertyId: propiedad.id,
        publicId: nuevaImagen.public_id,
        url: nuevaImagen.secure_url,
        isPrimary: true,
        order: 0
      })

      await propiedad.update({ mainImageUrl: nuevaImagen.secure_url })
    }

    // Whitelisted fields — nunca permitir mutar userId ni id
    const {
      title, description, propertyType, operationType,
      price, currency, totalArea, coveredArea,
      bedrooms, bathrooms, garages, age,
      address, city, state, postalCode, country,
      latitude, longitude, status, featured
    } = req.body

    await propiedad.update({
      title, description, propertyType, operationType,
      price, currency, totalArea, coveredArea,
      bedrooms, bathrooms, garages, age,
      address, city, state, postalCode, country,
      latitude, longitude, status, featured
    })

    await propiedad.reload({ include: [{ model: PropertyImage, as: 'images' }] })

    res.status(200).json({
      success: true,
      message: 'Propiedad actualizada',
      data: propiedad
    })
  } catch (error) {
    logger.error('Error al actualizar propiedad', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la propiedad',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    })
  }
}

// DELETE /api/v1/users/me/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params
    const { sub: userId } = req.user

    const propiedad = await Property.findByPk(id, {
      include: [{ model: PropertyImage, as: 'images' }]
    })

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    // Eliminar imágenes de Cloudinary
    if (propiedad.images?.length > 0) {
      for (const imagen of propiedad.images) {
        if (imagen.publicId) {
          await cloudinary.uploader.destroy(imagen.publicId)
        }
      }
    }

    await propiedad.destroy()

    // 204 No Content — estándar REST para DELETE exitoso
    res.status(204).send()
  } catch (error) {
    logger.error('Error al eliminar propiedad', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la propiedad',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    })
  }
}

// PATCH /api/v1/users/me/properties/:id
export const togglePropertyActive = async (req, res) => {
  try {
    const { id } = req.params
    const { active } = req.body
    const { sub: userId } = req.user

    const propiedad = await Property.findByPk(id)

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    propiedad.active = Boolean(active)
    await propiedad.save()

    res.status(200).json({
      success: true,
      message: `Propiedad ${propiedad.active ? 'activada' : 'desactivada'}`,
      data: { active: propiedad.active }
    })
  } catch (error) {
    logger.error('Error al cambiar estado', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// ─── Endpoints de imágenes individuales ──────────────────────

// POST /api/v1/users/me/properties/:id/images
export const addImages = async (req, res) => {
  try {
    const { id } = req.params
    const { sub: userId } = req.user

    const propiedad = await Property.findByPk(id, {
      include: [{ model: PropertyImage, as: 'images' }]
    })

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Se requiere al menos una imagen' })
    }

    const currentCount = propiedad.images?.length || 0
    if (currentCount + req.files.length > 8) {
      return res.status(400).json({ success: false, message: `Se permite máximo 8 imágenes. Actuales: ${currentCount}` })
    }

    const uploads = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)))
    const noPrimaryExists = currentCount === 0

    await Promise.all(uploads.map((result, index) =>
      PropertyImage.create({
        propertyId: id,
        publicId: result.public_id,
        url: result.secure_url,
        isPrimary: noPrimaryExists && index === 0,
        order: currentCount + index
      })
    ))

    const updatedProperty = await Property.findByPk(id, {
      include: [{ model: PropertyImage, as: 'images' }]
    })

    res.status(201).json({
      success: true,
      message: 'Imágenes agregadas correctamente',
      data: updatedProperty.images
    })
  } catch (error) {
    logger.error('Error al agregar imágenes', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// DELETE /api/v1/users/me/properties/:id/images/:imageId
export const deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params
    const { sub: userId } = req.user

    const propiedad = await Property.findByPk(id)

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    const imagen = await PropertyImage.findOne({ where: { id: imageId, propertyId: id } })

    if (!imagen) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' })
    }

    if (imagen.publicId) {
      await cloudinary.uploader.destroy(imagen.publicId)
    }

    // beforeDestroy hook maneja la re-asignación de primary automáticamente
    await imagen.destroy()

    res.status(200).json({ success: true, message: 'Imagen eliminada' })
  } catch (error) {
    logger.error('Error al eliminar imagen', { error: error.message, imageId: req.params.imageId })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// PUT /api/v1/users/me/properties/:id/images/:imageId/primary
export const setImagePrimary = async (req, res) => {
  try {
    const { id, imageId } = req.params
    const { sub: userId } = req.user

    const propiedad = await Property.findByPk(id)

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    const imagen = await PropertyImage.findOne({ where: { id: imageId, propertyId: id } })

    if (!imagen) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' })
    }

    // beforeUpdate hook maneja desmarcar las demás y actualizar mainImageUrl
    await imagen.setAsPrimary()

    res.status(200).json({ success: true, message: 'Imagen marcada como principal', data: imagen })
  } catch (error) {
    logger.error('Error al cambiar imagen principal', { error: error.message, imageId: req.params.imageId })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

// PUT /api/v1/users/me/properties/:id/images/reorder
export const reorderImages = async (req, res) => {
  try {
    const { id } = req.params
    const { sub: userId } = req.user
    const { order } = req.body

    const propiedad = await Property.findByPk(id)

    if (!propiedad) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    if (propiedad.userId !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'El campo "order" debe ser un array de IDs' })
    }

    await PropertyImage.reorder(id, order)

    const updatedImages = await PropertyImage.getGallery(id)

    res.status(200).json({ success: true, message: 'Orden actualizado', data: updatedImages })
  } catch (error) {
    logger.error('Error al reordenar imágenes', { error: error.message, propiedadId: req.params.id })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}
