import { createElement } from './utils'
import { getShips } from './Ships'
import { buildGameboardDOMByModel } from './GameboardDOM'
import {
  listenSubmitClick,
  listenRotateClick,
  listenRandomSchemeClick
} from './ShipSetupListener'

export function buildGameboard (parentNode, player) {
  const gameboard = buildGameboardDOMByModel(
    true,
    false,
    player.getGameboard(),
    null,
    false
  )
  parentNode.appendChild(gameboard.container)
  return gameboard
}

export const createShipSetup = (player, playerList, hasNextPlayer) => {
  function build () {
    const container = createElement('main', null, 'ships-setup', document.body)
    buildShiSetupTitle(container)
    buildShipsContainer(container)
    buildActionButtons(container)
    buildGameboard(container, player)
    buildShiSetupFinishTitle(container)
    buildSubmitButton(container)
  }

  function buildShiSetupTitle (parentNode) {
    const title = createElement('h2', null, null, parentNode)
    title.textContent = `${player.getName()}, setup your ships`
  }

  function buildShipsContainer (parentNode) {
    const container = createElement('div', null, 'ships-container', parentNode)
    const ships = createElement('div', null, 'ships', container)
    ships.setAttribute('rotate', 'horizontal')
    getShips().forEach(ship => buildShip(ship.length, ships))
  }

  function buildShip (shipLength, parentNode) {
    const ship = createElement('div', 'ship', null, parentNode)
    for (let i = 0; i < shipLength; i++) {
      createElement('div', 'ship-component', null, ship)
    }
  }

  function buildActionButtons (parentNode) {
    const container = createElement(
      'div',
      null,
      'action-button-container',
      parentNode
    )
    const rotate = createElement('button', 'btn', null, container)
    // TODO ADICIONAR ICONES
    rotate.textContent = 'Rotate'
    const random = createElement('button', 'btn', null, container)
    random.textContent = 'Random'
    rotate.addEventListener(
      'click',
      listenRotateClick.bind(event, player, playerList)
    )
    random.addEventListener(
      'click',
      listenRandomSchemeClick.bind(event, player, playerList)
    )
  }

  function buildShiSetupFinishTitle (parentNode) {
    const title = createElement('h3', null, null, parentNode)
    title.textContent = hasNextPlayer ? 'Start next setup' : 'Start game'
  }

  function buildSubmitButton (parentNode) {
    const button = createElement('button', 'btn', null, parentNode)
    button.textContent = hasNextPlayer ? 'Next setup' : 'Start game'
    button.addEventListener(
      'click',
      listenSubmitClick.bind(event, player, playerList)
    )
  }

  build()
}
