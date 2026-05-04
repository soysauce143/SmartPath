//import { BleClient } from '@capacitor-community/bluetooth-le';
// Use this instead to access the native bridge
const { BluetoothLe } = Capacitor.Plugins;
const BleClient = BluetoothLe;

// Your UUIDs remain the same
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

let connectedDeviceId = null;

/**
 * 1. INITIALIZE & CONNECT
 * This function wakes up the phone's Bluetooth radio and 
 * opens the native pairing window.
 */
window.connect = async () => {
    const statusElement = document.getElementById('status');
    
    try {
        // Initialize the Capacitor Bluetooth engine
        await BleClient.initialize();

        // Request the specific hardware device
        const device = await BleClient.requestDevice({
            services: [SERVICE_UUID],
        });

        // Establish the connection
        await BleClient.connect(device.deviceId);
        connectedDeviceId = device.deviceId;

        // Update the UI for your technician review
        statusElement.innerText = "Status: Connected";
        statusElement.style.color = "#69f0ae"; // Green
        alert("Success! Connected to: " + (device.name || "Hardware"));

    } catch (error) {
        console.error("Bluetooth Connection Error:", error);
        statusElement.innerText = "Status: Error";
        statusElement.style.color = "#ff5252"; // Red
        alert("Connection failed: " + error.message);
    }
};

/**
 * 2. SEND COMMANDS
 * This sends the characters ('F', 'B', 'L', 'R', 'S') to your 
 * Arduino/Microcontroller via the JDY-16.
 */
window.sendCmd = async (command) => {
    if (!connectedDeviceId) {
        console.warn("No device connected. Command ignored: " + command);
        return;
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(command);
        
        // Write the command to the hardware characteristic
        await BleClient.write(
            connectedDeviceId, 
            SERVICE_UUID, 
            CHAR_UUID, 
            data
        );
        
        console.log("Sent Command: " + command);
    } catch (error) {
        console.error("Write Error:", error);
    }
};