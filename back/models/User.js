import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

export const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true, // Can be null if using Google login
    field: 'password_hash' // Maps to password_hash in DB
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'phone'
  },
  // Auth and Social
  googleId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'google_id'
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'avatar_url'
  },
  // Recovery tokens
  recoveryToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'recovery_token'
  },
  recoveryTokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'recovery_token_expiration'
  },

  // Email verification
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'verification_token'
  },
  verificationTokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verification_token_expiration'
  },

  // Type and status
  userType: {
    type: DataTypes.ENUM('owner', 'agent', 'admin', 'buyer'),
    defaultValue: 'buyer',
    field: 'user_type'
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'verified'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'active'
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'registration_date'
  },
  lastSession: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_session'
  }
}, {
  timestamps: true,
  underscored: true,

  // Hooks
  hooks: {
    beforeCreate: async function (user) {
      if (user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    beforeUpdate: async function (user) {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  },

  // Scopes
  scopes: {
    hideInfo: {
      attributes: {
        exclude: [
          'password',
          'recoveryToken',
          'recoveryTokenExpiration',
          'googleId',
          'createdAt',
          'updatedAt'
        ]
      }
    },
    public: {
      attributes: [
        'id',
        'firstName',
        'lastName',
        'avatarUrl',
        'userType'
      ]
    }
  }
})

// metodos de instancia
User.prototype.verifyPassword = async function (password) {
  if (!this.password) return false // If using Google login
  return await bcrypt.compare(password, this.password)
}

User.prototype.updateLastSession = async function () {
  this.lastSession = new Date()
  await this.save()
}

// metodos estaticos
User.findByEmail = async function (email) {
  return await User.findOne({ where: { email } })
}

User.findByGoogleId = async function (googleId) {
  return await User.findOne({ where: { googleId } })
}
