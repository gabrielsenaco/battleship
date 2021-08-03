import { Player } from './Player'
import { Gameboard } from './Gameboard'
import { Ship } from './Ship'

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
  opponet.attack(playerMainGameboard, 3, 6)
  expect(playerMainGameboard.getPosition(3, 6).hitted).toBeTruthy()
  expect(opponet.getGameboard().getPosition(3, 6).hitted).toBeFalsy()
})

//test('Test AI...')
