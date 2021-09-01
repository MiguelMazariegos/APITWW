const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
    },
    fecha_creacion: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema);