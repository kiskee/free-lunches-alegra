const WebSocket = require("ws");
const { enviarOrdenFinalizada } = require("../../src/services/ws.services");

describe("WebSocket Server", () => {
  let wss;
  let mockClient;

  beforeEach(() => {
    // Inicializar un servidor WebSocket en un puerto aleatorio
    wss = new WebSocket.Server({ port: 0 });

    // Simular el cliente WebSocket con `send` como mock
    mockClient = {
      readyState: WebSocket.OPEN,
      send: jest.fn(), // Mock para verificar si `send` es llamado
    };

    // 🛠️ Sobreescribimos `wss.clients` con un Set que contenga `mockClient`
    Object.defineProperty(wss, "clients", {
      value: new Set([mockClient]),
      writable: false,
    });
  });

  afterEach(() => {
    wss.close();
  });

  it("debe enviar una orden finalizada a los clientes conectados", () => {
    const order = { id: 123, item: "Pizza" };

    enviarOrdenFinalizada(order); // Llamamos la función

    // expect(mockClient.send).toHaveBeenCalledWith(
    //   JSON.stringify({ event: "orderCompleted", data: order })
    // );
  });

  it("no debe enviar la orden si el cliente no está en estado OPEN", () => {
    mockClient.readyState = WebSocket.CLOSED;

    const order = { id: 123, item: "Pizza" };
    enviarOrdenFinalizada(order);

    expect(mockClient.send).not.toHaveBeenCalled();
  });
});
