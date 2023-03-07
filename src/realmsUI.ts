import { getParcel } from '@decentraland/ParcelIdentity'
const cataList = [
  'https://interconnected.online',
  'https://peer.decentral.io',
  'https://peer.melonwave.com',
  'https://peer.kyllian.me',
  'https://peer-ap1.decentraland.org',
  'https://peer.uadevops.com',
  'https://peer.dclnodes.io',
  'https://peer-eu1.decentraland.org',
  'https://peer-ec1.decentraland.org',
  'https://peer-wc1.decentraland.org',
  'https://peer-ec2.decentraland.org'
]
class UIRealmsSystem {
  lastUpdate = 0
  canvas = new UICanvas()
  container = new UIContainerRect(this.canvas)
  title = new UIText(this.container)
  titleCount = new UIText(this.container)
  realmsContainers: UIContainerRect[] = []
  realmsName: UIText[] = []
  realmsCount: UIText[] = []
  catalystNames: string[] = []
  scene = getParcel()
  parcels: string[] = []
  constructor() {
    this.container.vAlign = 'top'
    this.container.hAlign = 'left'
    this.container.positionX = 10
    this.container.positionY = -120
    this.container.width = 150
    this.container.height = 120
    this.container.color = Color4.Black()
    this.title.value = 'Total users:'
    this.title.positionY = 25
    this.title.positionX = 15
    this.title.vTextAlign = 'top'
    this.title.hTextAlign = 'left'
    this.title.hAlign = 'left'
    this.titleCount.value = '...Loading'
    this.titleCount.positionY = 25
    this.titleCount.positionX = -15
    this.titleCount.vTextAlign = 'top'
    this.titleCount.hTextAlign = 'right'
    this.titleCount.hAlign = 'right'
    this.realmsContainers[0] = new UIContainerRect(this.container)
    this.realmsContainers[1] = new UIContainerRect(this.container)
    this.realmsContainers[2] = new UIContainerRect(this.container)
    for (const index in this.realmsContainers) {
      if (Object.prototype.hasOwnProperty.call(this.realmsContainers, index)) {
        const container = this.realmsContainers[index]
        const background = new UIContainerRect(container)
        container.height = 20
        container.width = 120
        container.positionY = 15 + +index * -25
        background.color = Color4.White()
        background.height = 20
        background.width = 120
        background.opacity = 0.2
        this.realmsName[index] = new UIText(container)
        const realmName = this.realmsName[index]
        realmName.value = ''
        realmName.vTextAlign = 'center'
        realmName.hTextAlign = 'left'
        realmName.opacity = 0.7
        this.realmsCount[index] = new UIText(container)
        const realmCount = this.realmsCount[index]
        realmCount.value = ''
        realmCount.vTextAlign = 'center'
        realmCount.hTextAlign = 'right'
        realmCount.opacity = 0.7
      }
    }
    void this.fetchNames()
    void executeTask(async () => {
      const scene = await this.scene
      const parcels = scene.land.sceneJsonData.scene.parcels
      const parcelsPlusOne = parcels.map((b) => getAllParcelsAround(b))
      let parcelsList: string[] = []
      parcelsList = parcelsList.concat(...parcelsPlusOne)
      this.parcels = parcelsList.filter(function (item, pos) {
        return parcelsList.indexOf(item) === pos
      })
      await this.fetchStats()
      this.lastUpdate = 0
    })
  }
  async update(dt: number) {
    this.lastUpdate += dt
    if (this.lastUpdate > 20) {
      this.lastUpdate = 0
      await this.fetchStats()
    }
  }
  async fetchNames() {
    const names = await Promise.all(cataList.map((a) => fetch(`${a}/about`).then(async (a) => await a.json())))
    this.catalystNames = names.map((a) => a.configurations.realmName)
  }
  async fetchStats() {
    if (!this.catalystNames.length) await this.fetchNames()
    const stats: Stats[] = await Promise.all(
      cataList.map((a) => fetch(`${a}/stats/parcels`).then(async (a) => await a.json()))
    )
    const res = stats.map((stat) => {
      const count = stat.parcels
        .filter((a) => this.parcels.indexOf(`${a.parcel.x},${a.parcel.y}`) !== -1)
        .map((a) => a.peersCount)
      if (!count.length) return 0
      else return count.reduce((a, b) => +a + +b)
    })
    const list = []
    list.push(
      ...res.map((usersCount, index) => {
        return { name: this.catalystNames[index], count: usersCount }
      })
    )
    const sortedList = list
      .filter((a) => a.count > 0)
      .sort((a, b) => {
        return b.count - a.count
      })
    const totalUsers = list.map((a) => a.count).reduce((a, b) => +a + +b)
    this.titleCount.value = `${totalUsers}`
    for (let index = 0; index < sortedList.length || index > 2; index++) {
      const element = sortedList[index]
      this.realmsName[index].value = element.name.toUpperCase()
      this.realmsCount[index].value = element.count.toString()
    }
    if (!this.container.visible) this.container.visible = true
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new UIRealmsSystem())

interface Stats {
  parcels: { peersCount: number; parcel: { x: number; y: number } }[]
}

function getAllParcelsAround(parcel: string): string[] {
  const [x, y] = parcel.split(',').map((a) => +a)
  const list: string[] = []
  for (let indexX = -1; indexX <= 1; indexX++) {
    for (let indexY = -1; indexY <= 1; indexY++) {
      list.push(`${x + indexX},${y + indexY}`)
    }
  }
  return list
}
