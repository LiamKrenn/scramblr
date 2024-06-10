import json

import matplotlib.pyplot as plt

# Load JSON data from a file
with open('idb_size_map_compress.json') as f:
  data = json.load(f)


  # Define the data
  solves = [int(key) for key in data.keys()]
  print(solves)
  disk_space = [int(value) / 1000000 for value in data.values()]

  # Create the plot
  plt.plot(solves, disk_space)

  # Add labels and title
  plt.xlabel('Solves')
  plt.ylabel('Disk Space (MB)')
  plt.title('Solves vs Disk Space')

  # Display the plot
  plt.show()
