import { Gameboard } from './Gameboard'

export const Player = () => {
  const enemyGameboard = Gameboard()
  const gameboard = Gameboard()

  function attack (enemyMainGameboard, x, y) {
    const response = enemyMainGameboard.receiveAttack(x, y)
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
