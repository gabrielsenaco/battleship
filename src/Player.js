import { Gameboard } from './Gameboard'
import { Ship } from './Ship'

export const Player = () => {
  const enemyGameboard = Gameboard()
  const gameboard = Gameboard()

  function attack (response, x, y) {
    if (response.ship) {
      enemyGameboard.placeShipPart(response.ship, x, y)
    }
    enemyGameboard.receiveAttack(x, y)
  }

  function getGameboard () {
    return gameboard
  }

  function getEnemyGameboard () {
    return enemyGameboard
  }

  return {
    attack,
    getGameboard,
    getEnemyGameboard
  }
}

export const ComputerPlayer = () => {
  const { attack, getGameboard, getEnemyGameboard } = Player()

  function getRandomTrueFalse () {
    return Math.random() >= 0.5
  }

  function getRandomPosition () {
    return Math.round(Math.random() * 9)
  }

  function buildGameboardScheme (shipListPattern) {
    for (const shipPattern of shipListPattern) {
      const horizontal = getRandomTrueFalse()
      let x = getRandomPosition()
      let y = getRandomPosition()
      const ship = Ship(shipPattern.length, horizontal)
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
    betterAttack
  }
}
