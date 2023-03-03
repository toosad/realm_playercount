# realm_playercount
 Simple UI showing total players in the scene and top 3 realms for Decentraland scene.


 Add realmsUI.ts file into src folder in your sdk project.

Only works on land or estate that are rectangular, Edit the rectangle area of your scene in the realmUI.ts file:

`.filter((a) => a.parcel.x > -5 && a.parcel.x < 0 && a.parcel.y > -36 && a.parcel.y < -33).`

You can edit color and opacity as well.

Feel free to Deploy scene in SDK6 and use for your project. 

Developed by HPrivakos.

