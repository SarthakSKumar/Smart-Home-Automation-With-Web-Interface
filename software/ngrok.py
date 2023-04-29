from pyngrok import ngrok
import socket
import os

# Get the public URL from ngrok
public_url = ngrok.connect("192.168.77.856:8888", "tcp")
print(public_url)

# Extract the host and port from the public URL
url = public_url.split(":")[1][2:]
print(url)
port = int(public_url.split(":")[2])

# Connect to the URL using a socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((url, port))

# Send a GET request to the server
request = "GET /data HTTP/1.1\r\nHost: {}\r\n\r\n".format(url)
s.send(request.encode())

# Receive the response from the server
response = s.recv(4096)
print(response.decode())

# Generate the path to the .env file in the web-interface directory
env_file_path = os.path.join(os.path.dirname(__file__), "..", "web-interface", ".env")

# Write the public URL to the .env file
with open(env_file_path, "w") as f:
    f.write(f"VITE_API_URL=http://{url}:{port}\n")

# Keep the connection open
while True:
    pass
