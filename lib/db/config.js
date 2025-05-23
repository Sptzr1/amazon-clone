// Configuración para la base de datos
export const dbConfig = {
  // Implementación de base de datos a usar
  // Opciones: 'mongodb', 'dummy'
  implementation: process.env.DB_IMPLEMENTATION || "mongodb",

  // Configuración para MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/amazonclone",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Otras configuraciones para otras implementaciones
  // ...
}
