import matplotlib.pyplot as plt

# Define the data
solves = [10806, 21612, 43224, 54030, 64836, 75642, 86448, 97254, 108060, 118866]
disk_space = [10.6, 18.7, 36.6, 46.3, 49.8, 55.8, 36.8, 64.7, 68.0, 51.6]

# Create the plot
plt.plot(solves, disk_space)

# Add labels and title
plt.xlabel('Solves')
plt.ylabel('Disk Space (MB)')
plt.title('Solves vs Disk Space')

# Display the plot
plt.show()
