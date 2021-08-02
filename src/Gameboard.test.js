import { Ship } from './Ship'
import { Gameboard } from './Gameboard'
/* {
      hitted: false,
      ship: ship
    }
    {
      hitted: false,
      ship: null
    }
  */

test('Place Ship on correct position', () => {
  const board = Gameboard()
  const ship = Ship(2)
  board.placeShip(ship, 0, 2)
  const expectBoardPosition = {
    hitted: false,
    ship
  }

  const boardPosition = board.getPosition(0, 2)
  expect(boardPosition).toMatchObject(expectBoardPosition)

  expect(boardPosition.ship.getParts()).toEqual([false, false])
})

test('Prevent Place Ship without around free', () => {
  const board = Gameboard()
  const ship = Ship(3)
  board.placeShip(ship, 0, 6)
  const ship3 = Ship(5)
  expect(() => board.placeShip(ship3, 3, 6)).toThrow(
    'Cannot place ship because around is not empty.'
  )
})

test('Get ocean when has no ship', () => {
  const board = Gameboard()
  const expectBoardPosition = {
    hitted: false,
    ship: null
  }
  const boardPosition = board.getPosition(2, 5)
  expect(boardPosition).toMatchObject(expectBoardPosition)
  expect(boardPosition.ship).toBeFalsy()
})

test('Check if attack hit the Ship', () => {
  const board = Gameboard()
  const ship = Ship(5)
  board.placeShip(ship, 4, 3)
  board.receiveAttack(6, 3)
  const expectBoardPosition = {
    hitted: true,
    ship
  }
  const boardPosition = board.getPosition(6, 3)
  expect(boardPosition).toMatchObject(expectBoardPosition)

  expect(boardPosition.ship.getParts()).toEqual([
    false,
    false,
    true,
    false,
    false
  ])
})

test('Check if attack hit the ocean', () => {
  const board = Gameboard()

  board.receiveAttack(8, 4)
  const expectBoardPosition = {
    hitted: true,
    ship: null
  }
  const boardPosition = board.getPosition(8, 4)
  expect(boardPosition).toMatchObject(expectBoardPosition)
})

test('Get the response attack of the Ship', () => {
  const board = Gameboard()
  const ship = Ship(1)
  board.placeShip(ship, 4, 3)
  const response = board.receiveAttack(4, 3)

  const expectResponse = {
    hitted: true,
    ship
  }

  expect(response).toMatchObject(expectResponse)
})

test('Get the response attack of the ocean', () => {
  const board = Gameboard()
  const response = board.receiveAttack(0, 1)

  const expectResponse = {
    hitted: true,
    ship: null
  }

  expect(response).toMatchObject(expectResponse)
})

test('Is the Ship positioned horizontally?', () => {
  const board = Gameboard()
  const ship = Ship(4)
  // ship, x, y, isHorinzotal
  board.placeShip(ship, 5, 3)
  const expectBoardPosition = {
    hitted: false,
    ship
  }
  const boardPosition = board.getPosition(7, 3)
  expect(boardPosition).toMatchObject(expectBoardPosition)
})

test('Is the Ship positioned vertically?', () => {
  const board = Gameboard()
  const ship = Ship(2, false)
  // ship, x, y, isHorinzotal
  board.placeShip(ship, 6, 2)
  const expectBoardPosition = {
    hitted: false,
    ship
  }
  const boardPosition = board.getPosition(6, 3)

  expect(boardPosition).toMatchObject(expectBoardPosition)
})

test('The Ship with 2 of length is sunk after attack?', () => {
  const board = Gameboard()
  const ship = Ship(2)
  board.placeShip(ship, 7, 2)
  const response = board.receiveAttack(7, 2)

  const expectResponse = {
    sunk: false
  }

  expect(response).toMatchObject(expectResponse)
  expect(ship.isSunk()).not.toBeTruthy()
})

test('The Ship with 1 of length is sunk after attack?', () => {
  const board = Gameboard()
  const ship = Ship(1)
  board.placeShip(ship, 7, 2)
  const response = board.receiveAttack(7, 2)

  const expectResponse = {
    sunk: true
  }

  expect(response).toMatchObject(expectResponse)
  expect(ship.isSunk()).toBeTruthy()
})

test('Attack all ships return true value.', () => {
  const board = Gameboard()
  const ship1 = Ship(1, false)
  board.placeShip(ship1, 2, 7)
  const ship2 = Ship(1)
  board.placeShip(ship2, 5, 6)
  const ship3 = Ship(1, false)
  board.placeShip(ship3, 6, 4)
  board.receiveAttack(2, 7)
  board.receiveAttack(5, 6)
  board.receiveAttack(6, 4)
  expect(board.isAllShipsSunk()).toBe(true)
})

test('Prevent put ships in position that is outside of grid', () => {
  const board = Gameboard()
  const ship1 = Ship(3)

  board.placeShip(ship1, 3, 7)
  const ship2 = Ship(5, true)
  expect(() => board.placeShip(ship2, 9, 7)).toThrow(
    'Cannot place ship on invalid grid position.'
  )
})
