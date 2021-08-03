import { Player, ComputerPlayer } from './Player'
import { Gameboard } from './Gameboard'
import { Ship } from './Ship'
import * as Ships from './Ships'

test("Get two gameboards: Player's gameboard and enemy's board", () => {
  const player = Player()
  expect(player.getGameboard()).toBeTruthy()
  expect(player.getEnemyGameboard()).toBeTruthy()
})

test('When send attack, attack only the enemy gameboard.', () => {
  const player = Player()
  const enemyMainGameboard = Gameboard()
  const enemyShip = Ship(5)
  enemyMainGameboard.placeShip(enemyShip, 4, 6)
  const respose1 = enemyMainGameboard.receiveAttack(4, 6)
  player.attack(respose1, 4, 6)
  const response2 = enemyMainGameboard.receiveAttack(8, 6)
  player.attack(response2, 8, 6)
  const enemyHitted = player.getEnemyGameboard().getPosition(4, 6).hitted
  const playerHitted = player.getGameboard().getPosition(4, 6).hitted

  expect(enemyMainGameboard.getPosition(4, 6).hitted).toBeTruthy()
  expect(enemyMainGameboard.getPosition(8, 6).hitted).toBeTruthy()
  expect(enemyMainGameboard.getPosition(8, 6).ship).toBeTruthy()
  expect(playerHitted).toBeFalsy()
  expect(enemyHitted).toBeTruthy()
})

test('Mark correctly when player receive attack by opponent', () => {
  const player = Player()
  const opponet = Player()
  const playerMainGameboard = player.getGameboard()
  const response = playerMainGameboard.receiveAttack(3, 6)
  opponet.attack(response, 3, 6)
  expect(playerMainGameboard.getPosition(3, 6).hitted).toBeTruthy()
  expect(opponet.getGameboard().getPosition(3, 6).hitted).toBeFalsy()
})

test('AI building the gameboard', () => {
  const ai = ComputerPlayer()
  ai.buildGameboardScheme(Ships.getShips())
  expect(ai.getGameboard().getShipsPoints().length).toBe(5)
})

test('AI attack any place on the enemy gameboard', () => {
  const ai = ComputerPlayer()
  const enemy = Player()
  const { x, y } = ai.betterAttack()
  const response = enemy.getGameboard().receiveAttack(x, y)
  ai.attack(response, x, y)
  expect(ai.getEnemyGameboard().getPosition(x, y).hitted).toBeTruthy()
  expect(enemy.getGameboard().getPosition(x, y).hitted).toBeTruthy()
})

test('AI never attack same place on the enemy gameboard', () => {
  const ai = ComputerPlayer()
  const enemy = Player()
  for (let i = 0; i < 100; i++) {
    const { x, y } = ai.betterAttack()
    const response = enemy.getGameboard().receiveAttack(x, y)
    ai.attack(response, x, y)
  }
  expect(
    ai
      .getEnemyGameboard()
      .getFlatGrid()
      .filter(position => position.hitted).length
  ).toBe(100)
  expect(
    enemy
      .getGameboard()
      .getFlatGrid()
      .filter(position => position.hitted).length
  ).toBe(100)
})

/* TODO - BUILD AN AI
test.only('When AI found a Ship part, it try find all parts first.', () => {
  const ai = ComputerPlayer()
  const enemy = Player()
  enemy.getGameboard().placeShip(Ship(3), 6, 3)
  const { x, y } = { x: 4, y: 3 }
  let response = enemy.getGameboard().receiveAttack(x, y)
  //expect(response).toBeFalsy()
  ai.attack(response, x, y)
  let safeBreak = 0
  while (response.ship && !response.ship.isSunk()) {
    const { x, y } = ai.betterAttack()
    response = enemy.getGameboard().receiveAttack(x, y)
    ai.attack(response, x, y)
    ++safeBreak
    if (safeBreak > 100) {
      break
    }
  }
  expect(response.ship).toBeTruthy()
  expect(response.ship.isSunk()).toBeTruthy()
})
*/
