const mongoose = require('mongoose');

// Modelo del esquema comentario para almacenar comentarios
// en mongo Atlas

const ComentarioSchema = new mongoose.Schema({
    showId: {
        type: String,
        required: true,
    },
    show: {
        type: String,
        required: true
    },
    comentario: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'publico',
        enum: ['publico', 'privado']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fecha_creacion: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Comentario', ComentarioSchema);