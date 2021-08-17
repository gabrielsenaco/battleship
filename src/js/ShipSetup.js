import { createElement } from './utils'
import { getShips } from './Ships'
import { buildGameboardDOMByModel } from './GameboardDOM'
import {
  listenSubmitClick,
  listenRotateClick,
  listenRandomSchemeClick,
  listenResetClick
} from './ShipSetupListener'
import {
  listenDragStart,
  listenDrop,
  listenDragOver,
  listenDragLeave
} from './ShipSetupDragDropListener'
import { setShipComponentImage } from './ShipDOM'

export function buildGameboard (parentNode, player) {
  const oldGameboard = parentNode.querySelector('.grid-container')
  if (oldGameboard) oldGameboard.remove()
  const gameboard = buildGameboardDOMByModel(
    true,
    false,
    player.getGameboard(),
    null,
    false
  )
  parentNode.appendChild(gameboard.container)
  gameboard.grid.addEventListener('drop', listenDrop.bind(event, player))
  gameboard.grid.addEventListener(
    'dragover',
    listenDragOver.bind(event, player)
  )
  gameboard.grid.addEventListener('dragleave', listenDragLeave)
  return gameboard
}

export function buildShipsContainer (parentNode, orientation) {
  const oldContainer = document.getElementById('ships-container')
  if (oldContainer) oldContainer.remove()
  const container = createElement('div', null, 'ships-container', parentNode)
  const ships = createElement('div', null, 'ships', container)
  ships.setAttribute('data-orientation', orientation)
  getShips().forEach((ship, index) =>
    _buildShip(ship.name, ship.length, ships, orientation, index)
  )
}

export function rotateShipsInContainer (orientation) {
  const ships = document.getElementById('ships')
  Array.from(ships.children).forEach(ship => {
    const length = parseInt(ship.getAttribute('data-length'))
    Array.from(ship.children).forEach((component, index) =>
      setShipComponentImage(component, length, index, orientation)
    )
  })
}

function _buildShip (shipName, shipLength, parentNode, orientation, id = 0) {
  const ship = createElement('div', 'ship', null, parentNode)
  ship.setAttribute('draggable', 'true')
  ship.setAttribute('data-length', shipLength)
  ship.setAttribute('data-id', id)
  ship.setAttribute('data-name', shipName)
  ship.addEventListener('dragstart', listenDragStart)
  for (let i = 0; i < shipLength; i++) {
    const component = createElement('div', 'ship-component', null, ship)
    setShipComponentImage(component, shipLength, i, orientation)
  }
}

function buildShiSetupTitle (parentNode, player) {
  const title = createElement('h2', 'title', null, parentNode)
  title.textContent = `${player.getName()}, place your ships`
}

function buildActionButtons (parentNode, player, playerList) {
  const container = createElement(
    'div',
    null,
    'action-button-container',
    parentNode
  )
  const rotate = createElement('button', 'btn', null, container)
  const random = createElement('button', 'btn', null, container)
  const reset = createElement('button', 'btn', null, container)
  rotate.textContent = 'Rotate'
  random.textContent = 'Random'
  reset.textContent = 'Reset'
  rotate.addEventListener(
    'click',
    listenRotateClick.bind(event, player, playerList)
  )
  random.addEventListener(
    'click',
    listenRandomSchemeClick.bind(event, player, playerList)
  )
  reset.addEventListener('click', listenResetClick.bind(event, player))
}

function buildShipSetupFinishTitle (parentNode, hasNextPlayer) {
  const title = createElement('h3', 'start-title subtitle', null, parentNode)
  title.textContent = hasNextPlayer ? 'Start next setup' : 'Start game'
}

function buildSubmitButton (parentNode, player, playerList, hasNextPlayer) {
  const button = createElement(
    'button',
    'btn start-game-btn confirm-form',
    null,
    parentNode
  )
  button.textContent = hasNextPlayer ? 'Next setup' : 'Start game'
  button.addEventListener(
    'click',
    listenSubmitClick.bind(event, player, playerList)
  )
}

export const createShipSetup = (player, playerList, hasNextPlayer) => {
  function build () {
    const container = createElement('main', null, 'ships-setup', document.body)
    buildShiSetupTitle(container, player)
    buildShipsContainer(container, 'horizontal')
    buildActionButtons(container, player, playerList)
    buildGameboard(container, player)
    buildShipSetupFinishTitle(container, hasNextPlayer)
    buildSubmitButton(container, player, playerList, hasNextPlayer)
  }

  build()
}
