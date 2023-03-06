# realm_playercount
Simple UI showing total players in the scene and top 3 realms for Decentraland scene.

Add realmsUI.ts file into src folder in your sdk project.

Automatically detect the lands in the scene and show users only on those lands.

You can edit color and opacity as well. Finally you can change the time  for the data to be fetched here (it is set to 20 seconds by default but you can increase it to optimize the scene):

`async update(dt: number) {
    this.lastUpdate += dt
    if (this.lastUpdate > 20) {
      this.lastUpdate = 0
      await this.fetchStats()
    }`

Feel free to Deploy scene in SDK6 and use for your project. 

Developed by [HPrivakos](https://github.com/HPrivakos).
