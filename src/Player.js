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
