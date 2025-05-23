// Servicio para órdenes (dummy)
const dummyOrders = []

export async function createOrder(orderData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder = {
        id: `order-${dummyOrders.length + 1}`,
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      dummyOrders.push(newOrder)

      resolve({
        success: true,
        order: newOrder,
      })
    }, 1000)
  })
}

export async function getOrdersByUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userOrders = dummyOrders.filter((order) => order.userId === userId)

      resolve({
        success: true,
        orders: userOrders,
      })
    }, 500)
  })
}

export async function getOrderById(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = dummyOrders.find((order) => order.id === orderId)

      if (order) {
        resolve({
          success: true,
          order,
        })
      } else {
        resolve({
          success: false,
          error: "Orden no encontrada",
        })
      }
    }, 500)
  })
}
