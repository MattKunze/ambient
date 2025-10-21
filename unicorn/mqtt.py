import gc
import machine
import time
from umqtt.simple import MQTTClient
import utime

from galactic import GalacticUnicorn
from picographics import PicoGraphics, DISPLAY_GALACTIC_UNICORN as DISPLAY

# create galactic object and graphics surface for drawing
gu = GalacticUnicorn()
graphics = PicoGraphics(DISPLAY)

width = GalacticUnicorn.WIDTH
height = GalacticUnicorn.HEIGHT

# set up some pens to use later
WHITE = graphics.create_pen(255, 255, 255)
BLACK = graphics.create_pen(0, 0, 0)

# MQTT Broker details
MQTT_BROKER = "192.168.1.3"
client_id = "galactic_unicorn"
heartbeat_topic = "heartbeat"
subscribe_topics = [b"unicorn/text", b"unicorn/sprite"]

def message_handler(topic, message):
    print((topic, message))
    if topic == b"unicorn/text":
        text = message.decode("utf-8")
        graphics.set_pen(BLACK)
        graphics.clear()
        outline_text(text, 1, 1)
    elif topic == b"unicorn/sprite":
        # Parse binary sprite data: [width, height, r,g,b,r,g,b,...]
        if len(message) < 2:
            print("Invalid sprite message: too short")
            return

        width = message[0]
        height = message[1]
        pixel_data = message[2:]

        # Validate message length
        expected_length = width * height * 3
        if len(pixel_data) != expected_length:
            print(f"Invalid sprite data length: expected {expected_length}, got {len(pixel_data)}")
            return

        # Clear the display
        graphics.set_pen(BLACK)
        graphics.clear()

        # Draw each pixel
        pixel_index = 0
        for y in range(height):
            for x in range(width):
                r = pixel_data[pixel_index]
                g = pixel_data[pixel_index + 1]
                b = pixel_data[pixel_index + 2]
                pixel_index += 3

                # Create pen for this color and draw pixel
                pen = graphics.create_pen(r, g, b)
                graphics.set_pen(pen)
                graphics.pixel(x, y)

        print(f"Rendered sprite: {width}x{height}")

# function for drawing outlined text
def outline_text(text, x, y):
    graphics.set_pen(BLACK)
    graphics.text(text, x - 1, y - 1, -1, 1)
    graphics.text(text, x, y - 1, -1, 1)
    graphics.text(text, x + 1, y - 1, -1, 1)
    graphics.text(text, x - 1, y, -1, 1)
    graphics.text(text, x + 1, y, -1, 1)
    graphics.text(text, x - 1, y + 1, -1, 1)
    graphics.text(text, x, y + 1, -1, 1)
    graphics.text(text, x + 1, y + 1, -1, 1)

    graphics.set_pen(WHITE)
    graphics.text(text, x, y, -1, 1)

proc=None			# Reference to the current process

def __main__(args):		# Entry point and command line arguments
    rtc = machine.RTC()

    client = MQTTClient(client_id, MQTT_BROKER)
    client.connect()

    client.set_callback(message_handler)
    for t in subscribe_topics:
        client.subscribe(t)

    t_count = 0
    t_total = 0

    while True:
        if proc.sts=="S":break	# Mechanism to stop the process if it is launched in batch (&)
        
        if proc.sts=="H":	# Mechanism to hold and resume the process if it is launched in batch (&) and held
            utime.sleep(1)
            continue

        tstart = time.ticks_ms()
        gc.collect()

        client.check_msg()  # Non-blocking check for new messages

        # update the display
        gu.update(graphics)

        tfinish = time.ticks_ms()

        total = tfinish - tstart
        t_total += total
        t_count += 1

        if t_count == 60:
            year, month, day, wd, hour, minute, second, _ = rtc.datetime()
            message = f"{client_id}:{year}-{month}-{day}T{hour}:{minute}:{second}"
            print(message)
            client.publish(heartbeat_topic, message)
            t_count = 0
            t_total = 0

        # pause for a moment (important or the USB serial device will fail)
        # try to pace at 60fps or 30fps
        if total > 1000 / 30:
            time.sleep(0.0001)
        elif total > 1000 / 60:
            t = 1000 / 30 - total
            time.sleep(t / 1000)
        else:
            t = 1000 / 60 - total
            time.sleep(t / 1000)