/**
 * Simple MQTT publisher using raw TCP sockets
 * Only implements the minimum needed to publish messages
 */

export async function publishMQTT(
  broker: string,
  port: number,
  topic: string,
  message: Uint8Array,
): Promise<void> {
  const socket = await Bun.connect({
    hostname: broker,
    port: port,
    socket: {
      data(socket, data) {
        // Receive data from broker (CONNACK, PUBACK, etc.)
        // For simple publish, we can ignore responses
      },
      open(socket) {
        // Send CONNECT packet
        const connectPacket = buildConnectPacket("bun_mqtt_client");
        socket.write(connectPacket);

        // Send PUBLISH packet
        const publishPacket = buildPublishPacket(topic, message);
        socket.write(publishPacket);

        // Close after a short delay to allow publish to complete
        setTimeout(() => socket.end(), 100);
      },
      close(socket) {
        // Connection closed
      },
      error(socket, error) {
        throw error;
      },
    },
  });

  // Wait for connection to complete
  await new Promise((resolve) => setTimeout(resolve, 200));
}

/**
 * Build MQTT CONNECT packet
 */
function buildConnectPacket(clientId: string): Uint8Array {
  const protocol = "MQTT";
  const protocolLevel = 4; // MQTT 3.1.1

  // Calculate packet length
  const clientIdBytes = new TextEncoder().encode(clientId);
  const variableHeaderLength = 10; // Protocol name (6) + level (1) + flags (1) + keepalive (2)
  const payloadLength = 2 + clientIdBytes.length; // Length prefix (2) + client ID
  const remainingLength = variableHeaderLength + payloadLength;

  const packet = new Uint8Array(2 + remainingLength);
  let offset = 0;

  // Fixed header
  packet[offset++] = 0x10; // CONNECT packet type
  packet[offset++] = remainingLength;

  // Variable header - Protocol name
  packet[offset++] = 0x00;
  packet[offset++] = 0x04; // Length of "MQTT"
  packet[offset++] = 0x4d; // M
  packet[offset++] = 0x51; // Q
  packet[offset++] = 0x54; // T
  packet[offset++] = 0x54; // T

  // Protocol level
  packet[offset++] = protocolLevel;

  // Connect flags (clean session)
  packet[offset++] = 0x02;

  // Keep alive (60 seconds)
  packet[offset++] = 0x00;
  packet[offset++] = 0x3c;

  // Payload - Client ID
  packet[offset++] = (clientIdBytes.length >> 8) & 0xff;
  packet[offset++] = clientIdBytes.length & 0xff;
  packet.set(clientIdBytes, offset);

  return packet;
}

/**
 * Build MQTT PUBLISH packet
 */
function buildPublishPacket(topic: string, message: Uint8Array): Uint8Array {
  const topicBytes = new TextEncoder().encode(topic);

  // Calculate remaining length
  const variableHeaderLength = 2 + topicBytes.length; // Topic length prefix + topic
  const remainingLength = variableHeaderLength + message.length;

  const packet = new Uint8Array(1 + encodedLength(remainingLength) + remainingLength);
  let offset = 0;

  // Fixed header
  packet[offset++] = 0x30; // PUBLISH packet type, QoS 0

  // Remaining length
  const lengthBytes = encodeRemainingLength(remainingLength);
  packet.set(lengthBytes, offset);
  offset += lengthBytes.length;

  // Variable header - Topic name
  packet[offset++] = (topicBytes.length >> 8) & 0xff;
  packet[offset++] = topicBytes.length & 0xff;
  packet.set(topicBytes, offset);
  offset += topicBytes.length;

  // Payload
  packet.set(message, offset);

  return packet;
}

/**
 * Encode remaining length field (variable length encoding)
 */
function encodeRemainingLength(length: number): Uint8Array {
  const bytes: number[] = [];
  do {
    let byte = length % 128;
    length = Math.floor(length / 128);
    if (length > 0) {
      byte |= 0x80;
    }
    bytes.push(byte);
  } while (length > 0);
  return new Uint8Array(bytes);
}

/**
 * Calculate the size of the encoded remaining length
 */
function encodedLength(length: number): number {
  let count = 0;
  do {
    length = Math.floor(length / 128);
    count++;
  } while (length > 0);
  return count;
}
