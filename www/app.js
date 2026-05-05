/**
 * SmartPath Pro - Final app.js
 * Optimized for JDY-16 Bluetooth Module
 */

// We access the plugin via the global Capacitor object to avoid "Module Specifier" errors
const BleClient = Capacitor.Plugins.BluetoothLe;

// Standard JDY-16 UUIDs for your research project
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

let connectedDeviceId = null;

/**
 * 1. INITIALIZE & CONNECT
 * Attached to 'window' so your HTML button's onclick="connect()" can see it.
 */
window.connect = async () => {
    const statusElement = document.getElementById('status');
    
    try {
        // Initialize the native Bluetooth engine
        await BleClient.initialize();

        // Request the JDY-16 device using the service UUID
        const device = await BleClient.requestDevice({
            services: [SERVICE_UUID],
        });

        // Connect to the selected device
        await BleClient.connect({ deviceId: device.deviceId });
        connectedDeviceId = device.deviceId;

        // Update UI
        statusElement.innerText = "Status: Connected";
        statusElement.style.color = "#69f0ae"; 
        console.log("Connected to: " + device.deviceId);

    } catch (error) {
        console.error("Bluetooth Error:", error);
        statusElement.innerText = "Status: Error";
        statusElement.style.color = "#ff5252";
    }
};

/**
 * 2. SEND COMMANDS
 * Sends 'F', 'B', 'L', 'R', or 'S' to the microcontroller.
 */
window.sendCmd = async (command) => {
    if (!connectedDeviceId) {
        console.warn("No hardware connected!");
        return;
    }

    try {
        // Convert the string character to a base64 string (required by the plugin)
        const encoder = new TextEncoder();
        const arrayBuffer = encoder.encode(command);
        const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        await BleClient.write({
            deviceId: connectedDeviceId,
            service: SERVICE_UUID,
            characteristic: CHAR_UUID,
            value: base64String
        });
        
        console.log("Sent: " + command);
    } catch (error) {
        console.error("Command failed:", error);
    }
};