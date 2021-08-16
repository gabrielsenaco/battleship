import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { getCurrentOrientation } from './ShipSetupListener'
import { Ship } from './Ship'
import { getGridLocationByItem } from './GameboardDOM'
import { getValidTopParentByValidator } from './utils'
import { buildGameboard } from './ShipSetup'

const ShipData = (name, length, orientation, id) => {
  return {
    name,
    length,
    orientation,
    id
  }
}

function buildShipData (dataTransfer, shipData) {
  for (const key of Object.keys(shipData)) {
    const value = shipData[key]
    dataTransfer.setData(key, value)
  }
}

function getShipData (dataTransfer) {
  const orientation = dataTransfer.getData('orientation')
  const length = parseInt(dataTransfer.getData('length'))
  const name = dataTransfer.getData('name')
  const id = parseInt(dataTransfer.getData('id'))
  return ShipData(name, length, orientation, id)
}

function getShipDataByDataTransfer (dataTransfer) {
  try {
    const data = getShipData(dataTransfer)
    const ship = Ship(data.name, data.length, data.orientation === 'horizontal')
    return { ship, data }
  } catch (err) {
    return err
  }
}

function listenDragStart (event) {
  const dataTransfer = event.dataTransfer
  const target = getValidTopParentByValidator(
    element => element.classList.contains('ship'),
    event.target
  )
  if (!target) return
  const orientation = getCurrentOrientation()
  const name = target.getAttribute('data-name')
  const length = parseInt(target.getAttribute('data-length'))
  const id = parseInt(target.getAttribute('data-id'))

  const shipData = ShipData(name, length, orientation, id)
  dataTransfer.setDragImage(target, 0, 10)
  buildShipData(dataTransfer, shipData)
}

function clearDragHover (element) {
  element.classList.remove('drag-hover', 'error')
}

function setDragHover (element, error = false) {
  element.classList.add('drag-hover')
  if (error) element.classList.add('error')
}

function listenDragOver (player, event) {
  const dataTransfer = event.dataTransfer
  event.preventDefault()
  const target = event.target
  const { x, y } = getGridLocationByItem(target)
  try {
    const { ship } = getShipDataByDataTransfer(dataTransfer)
    player.getGameboard().tryPlaceShip(ship, x, y)
    setDragHover(target)
  } catch (err) {
    setDragHover(target, true)
    dataTransfer.dropEffect = 'none'
  }
}

function listenDragLeave (event) {
  clearDragHover(event.target)
}

function listenDrop (player, event) {
  const dataTransfer = event.dataTransfer
  const target = event.target
  const { x, y } = getGridLocationByItem(target)

  try {
    const { ship, data } = getShipDataByDataTransfer(dataTransfer)
    player.getGameboard().placeShip(ship, x, y)
    const main = document.getElementById('ships-setup')
    buildGameboard(main, player)
    const shipElement = document.querySelector(`.ship[data-id='${data.id}']`)
    if (shipElement) shipElement.remove()
  } catch (err) {
    PubSub.publish(TOPIC.SEND_LOG, {
      message: `Error found: ${err.message}`,
      type: 'error'
    })
  }
}

export { listenDragStart, listenDrop, listenDragOver, listenDragLeave }
