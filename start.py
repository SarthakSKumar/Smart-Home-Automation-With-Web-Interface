import subprocess

# Run the first command: 'cd web-interface && npm run dev'
command1 = "cd web-interface && npm run dev"
process1 = subprocess.Popen(command1, shell=True)

# Run the second command: 'cd software && python ngrok.py'
command2 = "cd software && python ngrok.py"
process2 = subprocess.Popen(command2, shell=True)

# Wait for both processes to finish
process1.wait()
process2.wait()
