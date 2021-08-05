import { Ship } from './Ship'

test('Create a Ship with 3 length', () => {
  const ship = Ship('Testing', 3)
  const expectParts = [false, false, false]
  expect(ship.getLength()).toBe(3)
  expect(ship.getParts()).toEqual(expectParts)
})

test('Prevent numbers equal or minor than zero', () => {
  const ship = Ship('Testing', -5)
  ship.hit(-3)
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
  for (let i = 1; i <= 5; i++) {
    ship.hit(i)
  }
  expect(ship.isSunk()).toBeTruthy()
})
