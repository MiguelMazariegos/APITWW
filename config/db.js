const mongoose = require('mongoose')

// Conexion a la base de datos con mongoose
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected: ${connect.connection.host}`)
    } catch (error) {
        console.error(error)
        console.error(process.env.MONGO_URI)
        process.exit(1)
    }
}

module.exports = connectDB