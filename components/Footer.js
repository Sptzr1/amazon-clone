export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Conócenos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Trabajar con nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Noticias
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Gana dinero con nosotros</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Vender en AmazonClone
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Programa de afiliados
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Anuncios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Métodos de pago</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Tarjetas de crédito
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Tarjetas de débito
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Transferencia bancaria
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">¿Necesitas ayuda?</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Atención al cliente
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} AmazonClone. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
