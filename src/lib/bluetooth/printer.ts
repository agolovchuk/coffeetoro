export async function Printer() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{
        services: ['000018f0-0000-1000-8000-00805f9b34fb']
      }]
    });

    const server = await device.gatt?.connect();

    if (typeof server === 'undefined') throw new Error('No gatt');

    const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");

    const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb")

  } catch (err) {
    console.warn(err);
  }
}
