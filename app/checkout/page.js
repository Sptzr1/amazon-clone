"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { clearCart } from "@/redux/features/cartSlice"
import { createOrder } from "@/services/orderService"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [loading, setLoading] = useState(false)

  const { items, totalAmount } = useSelector((state) => state.cart)
  const { user } = useAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  const { showToast } = useToast()

  const shippingCost = totalAmount > 50 ? 0 : 5.99
  const tax = totalAmount * 0.16 // 16% de impuesto
  const totalWithTaxAndShipping = totalAmount + shippingCost + tax

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        userId: user.id,
        items,
        totalAmount: totalWithTaxAndShipping,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: `xxxx-xxxx-xxxx-${paymentInfo.cardNumber.slice(-4)}`,
          cvv: "***",
        },
      }

      const result = await createOrder(orderData)

      if (result.success) {
        dispatch(clearCart())
        showToast("¡Pedido realizado con éxito!", "success")
        router.push(`/order-confirmation/${result.order.id}`)
      }
    } catch (error) {
      showToast("Error al procesar el pedido", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 font-medium">Información de envío</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 font-medium">Método de pago</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 3 ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="ml-2 font-medium">Revisar pedido</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Información de envío</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        Estado/Provincia
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Código postal
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Método de pago</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de expiración
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        required
                        placeholder="MM/AA"
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        required
                        placeholder="123"
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="border border-gray-300 px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Revisar pedido</h2>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Información de envío</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>{shippingInfo.fullName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p>Teléfono: {shippingInfo.phone}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Método de pago</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>Tarjeta: **** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                      <p>Nombre: {paymentInfo.cardName}</p>
                      <p>Expiración: {paymentInfo.expiryDate}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Resumen del pedido</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Envío</span>
                          {shippingCost === 0 ? (
                            <span className="text-green-600">Gratis</span>
                          ) : (
                            <span>${shippingCost.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span>Impuestos</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${totalWithTaxAndShipping.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="border border-gray-300 px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Procesando..." : "Confirmar pedido"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

            <div className="max-h-80 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center py-2 border-b">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalWithTaxAndShipping.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
