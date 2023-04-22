from pyngrok import ngrok
import socket

public_url = ngrok.connect(8888, "tcp").public_url
print(public_url)

url = public_url.split(":")[1][2:]
port = int(public_url.split(":")[2])

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

s.connect((url, port))

while True:
    request = "GET /data HTTP/1.1\r\nHost: {}\r\n\r\n".format(url)
    s.send(request.encode())
    response = s.recv(4096)
    print(response.decode())
