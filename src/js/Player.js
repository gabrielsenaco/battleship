import { Gameboard } from './Gameboard'
import { Ship } from './Ship'
import { getRandomTrueFalse } from './utils'

function getRandomPosition () {
  return Math.round(Math.random() * 9)
}

export const Player = name => {
  const enemyGameboard = Gameboard()
  const gameboard = Gameboard()

  function attack (response, x, y) {
    if (response.ship) {
      enemyGameboard.placeShipPart(Ship(1), x, y)
    }
    enemyGameboard.receiveAttack(x, y)
  }

  function getGameboard () {
    return gameboard
  }

  function getName () {
    return name
  }

  function getEnemyGameboard () {
    return enemyGameboard
  }

  function buildGameboardScheme (shipListPattern) {
    for (const shipPattern of shipListPattern) {
      const horizontal = getRandomTrueFalse()
      let x = getRandomPosition()
      let y = getRandomPosition()
      const ship = Ship(shipPattern.name, shipPattern.length, horizontal)
      while (true) {
        try {
          getGameboard().placeShip(ship, x, y)
          break
        } catch (_) {
          x = getRandomPosition()
          y = getRandomPosition()
        }
      }
    }
  }

  return {
    attack,
    getGameboard,
    getEnemyGameboard,
    getName,
    buildGameboardScheme
  }
}

export const ComputerPlayer = name => {
  const {
    attack,
    getGameboard,
    getEnemyGameboard,
    getName,
    buildGameboardScheme
  } = Player(name)

  function betterRandomAttack () {
    let response = {}
    let position = null

    while (!position || position.hitted) {
      response = { x: getRandomPosition(), y: getRandomPosition() }
      position = getEnemyGameboard().getPosition(response.x, response.y)
    }
    return response
  }

  function betterAttack () {
    return betterRandomAttack()
  }

  return {
    attack,
    getGameboard,
    getEnemyGameboard,
    buildGameboardScheme,
    betterAttack,
    getName
  }
}
