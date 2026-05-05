console.log("SMARTPATH: app.js has started loading...");

// Use the global Capacitor object
const BleClient = Capacitor.Plugins.BluetoothLe;

// JDY-16 Standard UUIDs
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

let connectedDeviceId = null;

/**
 * Helper to convert string to Hex (e.g., 'F' -> '46')
 * Prevents "Invalid Hexadecimal Character" crashes.
 */
const stringToHex = (str) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
};

// Define the connect function
const connect = async () => {
    console.log("SMARTPATH: Pair Button Clicked!"); 
    const statusElement = document.getElementById('status');
    
    try {
        await BleClient.initialize();
        const device = await BleClient.requestDevice({
            services: [SERVICE_UUID],
        });

        await BleClient.connect({ deviceId: device.deviceId });
        connectedDeviceId = device.deviceId;

        if (statusElement) {
            statusElement.innerText = "Status: Connected";
            statusElement.style.color = "#69f0ae";
        }
        console.log("SMARTPATH: Connected to " + device.deviceId);
    } catch (error) {
        console.error("SMARTPATH: Connection Error", error);
    }
};

// Define the send command function
const sendCmd = async (command) => {
    if (!connectedDeviceId) return;

    try {
        const hexValue = stringToHex(command);
        await BleClient.write({
            deviceId: connectedDeviceId,
            service: SERVICE_UUID,
            characteristic: CHAR_UUID,
            value: hexValue
        });
        console.log("Sent: " + command + " (Hex: " + hexValue + ")");
    } catch (error) {
        console.error("SMARTPATH: Write Error", error);
    }
};

// Attach functions to 'window' for HTML access
window.connect = connect;
window.sendCmd = sendCmd;

//hahahahhahahaha