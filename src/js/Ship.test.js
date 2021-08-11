import { Ship } from './Ship'

test('Create a Ship with 3 length', () => {
  const ship = Ship('Testing', 3)
  const expectParts = [false, false, false]
  expect(ship.getLength()).toBe(3)
  expect(ship.getParts()).toEqual(expectParts)
})

test('Prevent numbers equal or minor than zero', () => {
  const ship = Ship('Testing', -5)
  expect(() => ship.hit(-3)).toThrow()
  expect(ship.getHits()).toBeFalsy()
  expect(ship.getParts()).toEqual([])
})

test('Send one hit', () => {
  const ship = Ship('Testing', 5)
  ship.hit(3)
  expect(ship.getHits()).toBe(1)
})

test('Hit on correctly position', () => {
  const ship = Ship('Testing', 3)
  ship.hit(1)
  const expectParts = [false, true, false]
  expect(ship.getParts()).toEqual(expectParts)
  expect(ship.isSunk()).toBeFalsy()
})

test('Sunk the Ship', () => {
  const ship = Ship('Testing', 5)
  for (let i = 0; i < 5; i++) {
    ship.hit(i)
  }
  expect(ship.isSunk()).toBeTruthy()
})

test('When have a gap in ship, this sunk?', () => {
  const ship = Ship('Testing', 3)
  ship.hit(0)
  ship.hit(2)
  const expectParts = [true, false, true]
  expect(ship.getParts()).toEqual(expectParts)
  expect(ship.getHits()).toBe(2)
  expect(ship.isSunk()).toBeFalsy()
})

test('When have a gap in ship with 5 length, this sunk?', () => {
  const ship = Ship('Testing', 5)
  ship.hit(1)
  ship.hit(0)
  ship.hit(2)
  ship.hit(4)
  const expectParts = [true, true, true, false, true]
  expect(ship.getParts()).toEqual(expectParts)
  expect(ship.getHits()).toBe(4)
  expect(ship.isSunk()).toBeFalsy()
})
