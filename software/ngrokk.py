import subprocess
import socket

# Start ngrok
subprocess.Popen([r'C:\Program Files (x86)\Ngrok', 'tcp', '5173'])

# Wait for ngrok to start and get the forwarding address
ngrok_address = ''
while not ngrok_address:
    output = subprocess.check_output(['curl', 'http://localhost:4040/api/tunnels'])
    ngrok_address = output.decode('utf-8').split('"')[11]

# Connect to the ngrok address
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((ngrok_address, 1))

# Send some data to the ngrok endpoint
s.send(b'Hello, ngrok!\n')

# Receive a response from the ngrok endpoints
data = s.recv(1024)
print(data.decode('utf-8'))

# Close the socket connection
s.close()
