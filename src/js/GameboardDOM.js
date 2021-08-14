import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { createElement } from './utils'
import {getValidBottomShipImage, getValidFrontShipImage, getValidBodyShipImage, getValidHittedShipImage} from './ShipDOM'
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export function buildGameboardDOM (
  bigSize,
  enemy,
  ownerName,
  buildSection = true
) {
  let containerClassName = 'grid-container'
  containerClassName += bigSize ? ' big' : ''
  const gridContainer = createElement('div', containerClassName, null)

  const gridDOM = createElement('div', 'grid', null, gridContainer)

  const gridNumbersIndex = createElement(
    'div',
    'grid-numbers-index',
    null,
    gridContainer
  )

  const gridLettersIndex = createElement(
    'div',
    'grid-letters-index',
    null,
    gridContainer
  )

  for (let i = 1; i <= 10; i++) {
    const numberIndex = createElement(
      'p',
      'grid-item grid-item-index',
      null,
      gridNumbersIndex
    )
    numberIndex.textContent = i

    const alphaIndex = createElement(
      'p',
      'grid-item grid-item-index',
      null,
      gridLettersIndex
    )
    alphaIndex.textContent = `${alphabet[i - 1]}`
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const gridItem = createElement('div', 'grid-item', null, gridDOM)
      gridItem.setAttribute('data-x', x)
      gridItem.setAttribute('data-y', y)
    }
  }

  if (buildSection) {
    const section = createGameboardSection(gridContainer, enemy, ownerName)
    return { section, container: gridContainer, grid: gridDOM }
  }
  return { container: gridContainer, grid: gridDOM }
}

export function buildGameboardDOMByModel (
  big,
  enemy,
  gameBoardModel,
  playerName,
  buildSection = true
) {
  const gameboardDOM = buildGameboardDOM(big, enemy, playerName, buildSection)
  updateGameboardDOMByModel(gameboardDOM, gameBoardModel)
  return gameboardDOM
}

export function updateGameboardDOMByModel (gameboardDOM, gameBoardModel) {
  if (!gameboardDOM || !gameBoardModel) return
  gameBoardModel.getFlatGrid().forEach((gridItem, index) => {
    const itemDOM = gameboardDOM.grid.children[index]
    if (gridItem.hitted) {
      itemDOM.classList.add('hitted')
      if (!gridItem.ship) {
        itemDOM.classList.add(getValidHittedImage())
        return
      }
    }

    const x = parseInt(itemDOM.getAttribute('data-x'))
    const y = parseInt(itemDOM.getAttribute('data-y'))
    if (gridItem.ship) {
      itemDOM.classList.add('ship-component')
      if (gridItem.hitted) {
        itemDOM.classList.add(getValidHittedShipImage())
        return
      }
      const next = gameBoardModel.getNextShipPart(gridItem.ship, x, y)
      const first = gameBoardModel.getFirstShipPartPosition(gridItem.ship)
      const orientation = gridItem.ship.isHorizontal() ? 'horizontal' : 'vertical'
      if (x === first.x && y === first.y) {
        itemDOM.classList.add(getValidFrontShipImage(orientation))
      } else
      if (!next) {
        itemDOM.classList.add(getValidBottomShipImage(orientation))
      } else {
        itemDOM.classList.add(getValidBodyShipImage())
      }
    }
  })
}

function updateGameboard (topic, { gameboard, gameboardDOM }) {
  updateGameboardDOMByModel(gameboardDOM, gameboard)
}

function hideGameboard (topic, gameboardDOM, name) {
  if (!gameboardDOM) return
  gameboardDOM.section.classList.add('hidden')
}

function showGameboard (topic, gameboardDOM) {
  if (!gameboardDOM) return
  gameboardDOM.section.classList.remove('hidden')
}

function requestToShowGameboard (topic, player) {
  if (!player.bot) {
    PubSub.publishSync(TOPIC.SHOW_GAMEBOARD, player.gameboardDOM)
  }

  PubSub.publishSync(TOPIC.SHOW_GAMEBOARD, player.enemyGameboardDOM)
}

function requestToHideGameboard (topic, player) {
  PubSub.publishSync(TOPIC.HIDE_GAMEBOARD, player.gameboardDOM)
  PubSub.publishSync(TOPIC.HIDE_GAMEBOARD, player.enemyGameboardDOM)
}

function getMainDOM () {
  let mainDOM = document.getElementById('gameboards')
  if (!mainDOM) {
    mainDOM = createElement('main', null, 'gameboards', document.body)
  }
  return mainDOM
}

function createGameboardSection (gridContainer, isEnemyGameboard, ownerName) {
  let sectionClass = 'gameboard-section '
  sectionClass += isEnemyGameboard ? 'target' : 'owner'
  const section = createElement('section', sectionClass, null, getMainDOM())
  const titleDOM = createElement('p', 'gameboard-title', null, section)
  titleDOM.textContent = isEnemyGameboard
    ? 'Target Gameboard'
    : `${ownerName + ',' || ''} Your Gameboard`
  if (isEnemyGameboard) {
    gridContainer.classList.add('big')
  }
  section.appendChild(gridContainer)
  return section
}

PubSub.subscribe(TOPIC.UPDATE_GAMEBOARD, updateGameboard)
PubSub.subscribe(TOPIC.SHOW_GAMEBOARD, showGameboard)
PubSub.subscribe(TOPIC.HIDE_GAMEBOARD, hideGameboard)
PubSub.subscribe(TOPIC.PING_SHOW_GAMEBOARD, requestToShowGameboard)
PubSub.subscribe(TOPIC.PING_HIDE_GAMEBOARD, requestToHideGameboard)
