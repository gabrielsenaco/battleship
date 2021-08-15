import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { getShips } from './Ships'
import {
  buildGameboard,
  createShipSetup,
  rotateShipsInContainer,
  buildShipsContainer
} from './ShipSetup'
import { isValidComputerPlayer } from './PlayerValidator'

/* @validateFlow
This feature will validate the current state of ship setup.
  - If it's ok to continue flow, will send true.
  - If not, will return false to break flow and will try resolve this problem.
*/
function validateFlow (nextPlayer, playerList) {
  if (playerList.length !== 2) {
    PubSub.publish(TOPIC.PING_SETUP_PLAYERS, {})
    return false
  }

  if (!nextPlayer) {
    PubSub.publish(TOPIC.START_GAME, playerList)
    return false
  }

  return true
}

function listenToShipSetup (topic, playerList) {
  const nextPlayers = playerList.filter(
    player => !player.getGameboard().hasPlacedAllShips(getShips().length)
  )
  const nextPlayer = nextPlayers[0]

  if (isValidComputerPlayer(nextPlayer)) {
    nextPlayer.buildGameboardScheme(getShips())
    return listenToShipSetup(topic, playerList)
  }

  if (!validateFlow(nextPlayer, playerList)) return
  PubSub.publish(TOPIC.SEND_LOG, {
    message: `Now it's time for player ${nextPlayer.getName()} to build his board scheme.`
  })
  const hasNextPlayer = nextPlayers.length > 1
  createShipSetup(nextPlayer, playerList, hasNextPlayer)
}

function listenSubmitClick (target, playerList, event) {
  if (!target.getGameboard().hasPlacedAllShips(getShips().length)) {
    PubSub.publish(TOPIC.SEND_LOG, {
      message:
        'You need to place all ships to continue. Hint: clicking on Random button, will setup a random gameboard scheme for you',
      type: 'error'
    })
    return
  }
  getMainShipSetup().remove()
  const nextPlayer = playerList.filter(
    player => !player.getGameboard().hasPlacedAllShips(getShips().length)
  )[0]

  if (!validateFlow(nextPlayer, playerList)) return

  PubSub.publish(TOPIC.SETUP_SHIPS, playerList)
}

function listenRandomSchemeClick (player, playerList, event) {
  player.getGameboard().reset()
  player.buildGameboardScheme(getShips())
  const main = getMainShipSetup()
  const ships = getShipsContainer()
  Array.from(ships.children).forEach(item => item.remove())
  buildGameboard(main, player)
}

function listenRotateClick (player, playerList, event) {
  const ships = getShipsContainer()
  let newValue = ships.getAttribute('data-orientation')
  newValue = newValue === 'vertical' ? 'horizontal' : 'vertical'

  ships.setAttribute('data-orientation', newValue)
  rotateShipsInContainer(newValue)
}

function getMainShipSetup () {
  return document.getElementById('ships-setup')
}

function getShipsContainer () {
  return document.getElementById('ships')
}

export function getCurrentOrientation () {
  const ships = getShipsContainer()
  if (ships) return ships.getAttribute('data-orientation')
}

function listenResetClick (player, event) {
  player.getGameboard().reset()
  const main = getMainShipSetup()
  buildGameboard(main, player)
  buildShipsContainer(main, getCurrentOrientation())
}

PubSub.subscribe(TOPIC.SETUP_SHIPS, listenToShipSetup)

export {
  listenSubmitClick,
  listenRotateClick,
  listenRandomSchemeClick,
  listenResetClick
}
