import { Gameboard } from './Gameboard'
import { Ship } from './Ship'
import { getRandomTrueFalse, getAdjacentsCoords } from './utils'

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

  function getAdjacents (x, y, horizontal, vertical) {
    const adjacents = []
    const adjacentsCoords = getAdjacentsCoords(x, y, horizontal, vertical)
    for (const adjacent of adjacentsCoords) {
      if (
        adjacent.x >= 0 &&
        adjacent.x < 10 &&
        adjacent.y < 10 &&
        adjacent.y >= 0
      ) {
        const position = getEnemyGameboard().getPosition(adjacent.x, adjacent.y)
        if (position) {
          adjacents.push({
            x: adjacent.x,
            y: adjacent.y,
            hitted: position.hitted,
            ship: position.ship
          })
        }
      }
    }

    return adjacents
  }

  function getOrientation (x, y) {
    const adjacents = getAdjacents(x, y, true, true)
    const vertical = adjacents.filter(point => point.y === y && point.ship)
    const horizontal = adjacents.filter(point => point.x === x && point.ship)

    if (horizontal.length > vertical.length) {
      return { horizontal: true, vertical: false }
    }

    if (horizontal.length < vertical.length) {
      return { horizontal: false, vertical: true }
    }

    return { horizontal: true, vertical: true }
  }

  function getEmptyAdjacents (x, y) {
    const orientation = getOrientation(x, y)

    const adjacents = getAdjacents(
      x,
      y,
      orientation.horizontal,
      orientation.vertical
    )
    return adjacents.filter(point => !point.hitted)
  }

  function betterSmartAttack () {
    try {
      const allShipParts = getEnemyGameboard().getAllShipPartsInGrid()
      const emptyList = []
      for (const part of allShipParts) {
        const emptys = getEmptyAdjacents(part.x, part.y)
        emptyList.push(emptys)
      }

      const better = emptyList.sort((a, b) => (a.length < b.length ? 1 : -1))[0]

      if (better && better.length > 0) return better[0]
    } catch (err) {
      return betterRandomAttack()
    }

    return betterRandomAttack()
  }

  function betterAttack () {
    return betterSmartAttack()
  }

  return {
    attack,
    getGameboard,
    getEnemyGameboard,
    getName,
    buildGameboardScheme,
    betterAttack
  }
}
