const mongoose = require('mongoose')

// LOCAL
const connection = async () => {
  try {
    console.log('Intentando conectar a:', process.env.MONGO_URI_nose)
    await mongoose.connect(process.env.MONGO_URI_nose, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Conectado a MongoDB')
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connection