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
  const prototype = Player(name)
  const baseAttack = prototype.attack

  function betterRandomAttack () {
    let response = {}
    let position = null

    while (!position || position.hitted) {
      response = { x: getRandomPosition(), y: getRandomPosition() }
      position = prototype
        .getEnemyGameboard()
        .getPosition(response.x, response.y)
    }
    return response
  }

  let lastSuccessAttack = { x: null, y: null }

  function attack (response, x, y, callback) {
    baseAttack.call(null, response, x, y)
    if (response.ship) {
      lastSuccessAttack = { x: response.x, y: response.y }
    }
  }

  function getEmptyAdjacents (x, y) {
    const emptyAdjacents = []
    const adjacents = [
      {
        x: x + 1,
        y
      },
      {
        x: x - 1,
        y
      },
      {
        x,
        y: y + 1
      },
      {
        x,
        y: y - 1
      }
    ]

    for (const adjacent of adjacents) {
      const position = prototype
        .getEnemyGameboard()
        .getPosition(adjacent.x, adjacent.y)
      if (position && !position.hitted) {
        emptyAdjacents.push({ x: adjacent.x, y: adjacent.y })
      }
    }

    return emptyAdjacents
  }

  function betterSmartAttack () {
    if (lastSuccessAttack.x === null && lastSuccessAttack.y === null) {
      return betterRandomAttack()
    }
    try {
      const allShipParts = prototype.getEnemyGameboard().getAllShipPartsInGrid()
      for (const part of allShipParts) {
        const emptys = getEmptyAdjacents(part.x, part.y)
        if (emptys.length > 0) {
          return emptys[0]
        }
      }
    } catch (err) {
      return betterRandomAttack()
    }

    return betterRandomAttack()
  }

  function betterAttack () {
    return betterSmartAttack()
  }

  return Object.assign(prototype, { attack, betterAttack })
}
