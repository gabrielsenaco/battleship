import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { getValidTopParentById } from './utils'
import { getShips } from './Ships'
import { buildGameboard, createShipSetup } from './ShipSetup'
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

  const hasNextPlayer = nextPlayers.length > 1
  createShipSetup(nextPlayer, playerList, hasNextPlayer)
}

function listenSubmitClick (target, playerList, event) {
  if (!target.getGameboard().hasPlacedAllShips(getShips().length)) {
    alert('you need to place all ships first.')
    return
  }
  const main = getValidTopParentById('ships-setup', event.target)
  main.remove()
  const nextPlayer = playerList.filter(
    player => !player.getGameboard().hasPlacedAllShips(getShips().length)
  )[0]

  if (!validateFlow(nextPlayer, playerList)) return

  PubSub.publish(TOPIC.SETUP_SHIPS, playerList)
}

function listenRandomSchemeClick (player, playerList, event) {
  player.getGameboard().reset()
  player.buildGameboardScheme(getShips())
  const main = getValidTopParentById('ships-setup', event.target)
  const gameboard = main.querySelector('.grid-container')
  const ships = main.querySelector('#ships')
  Array.from(ships.children).forEach(item => item.remove())
  if (gameboard) gameboard.remove()
  buildGameboard(main, player)
}

function listenRotateClick (player, playerList, event) {
  const main = getValidTopParentById('ships-setup', event.target)
  const ships = main.querySelector('#ships')
  let newValue = ships.getAttribute('rotate')
  newValue = newValue === 'vertical' ? 'horizontal' : 'vertical'

  ships.setAttribute('rotate', newValue)
}

PubSub.subscribe(TOPIC.SETUP_SHIPS, listenToShipSetup)
// todo draggable functions here

export { listenSubmitClick, listenRotateClick, listenRandomSchemeClick }
