// On x and y, the number starts on 0 and end on 9.
export const Gameboard = () => {
  const grid = _build()

  function _build () {
    const array = []
    for (let x = 0; x < 10; x++) {
      const xArray = []
      for (let y = 0; y < 10; y++) {
        xArray.push({ hitted: false, ship: null })
      }
      array.push(xArray)
    }
    return array
  }

  function _isOnRange (x, y) {
    if (x < 0 || x >= 10 || y >= 10 || y < 0) {
      throw new Error('Array item not found. Insert number in 0..9')
    }
    return true
  }

  function fixShipLength (ship) {
    const length = ship.getLength()
    return length === 1 ? 0 : length
  }

  function canPlaceShip (ship, x, y) {
    const length = fixShipLength(ship)
    const testGrid = [...grid]
    const shipPart = ship.isHorizontal()
      ? testGrid[x + length]
      : testGrid[x][y + length]
    if (!shipPart) {
      return false
    }

    return true
  }

  function aroundIsEmpty (x, y) {
    const points = {
      default: { x, y },
      top: { x, y: y - 1 },
      bottom: { x, y: y + 1 },
      left: { x: x - 1, y },
      right: { x: x + 1, y }
    }

    for (const point of Object.values(points)) {
      const pointX = grid[point.x]
      if (!pointX) continue // if is out of grid, skip
      const position = grid[point.x][point.y]
      if (!position) continue // if is out of grid, skip

      const shipPart = position.ship

      if (shipPart) return false
    }
    return true
  }

  function canPutShipWithAroundFree (ship, x, y, isSameShip = false) {
    const target = ship.isHorizontal() ? x : y
    const length = fixShipLength(ship)
    for (let i = target; i <= length + target; i++) {
      try {
        const point = ship.isHorizontal() ? grid[i - 1][y] : grid[x][i - 1]
        if (isSameShip && point.ship && point.ship === ship) {
          return true
        }
      } catch (_) {}
      const empty = ship.isHorizontal()
        ? aroundIsEmpty(i, y)
        : aroundIsEmpty(x, i)
      if (!empty) return false
    }

    return true
  }

  function placeShipPart (ship, x, y) {
    _isOnRange(x, y)
    if (!canPutShipWithAroundFree(ship, x, y, true)) {
      throw new Error('Cannot place ship because around is not empty.')
    }
    grid[x][y].ship = ship
  }

  function placeShip (ship, x, y) {
    _isOnRange(x, y)
    if (!canPutShipWithAroundFree(ship, x, y)) {
      throw new Error('Cannot place ship because around is not empty.')
    }
    if (!canPlaceShip(ship, x, y)) {
      throw new Error('Cannot place ship on invalid grid position.')
    }
    const target = ship.isHorizontal() ? x : y
    const length = fixShipLength(ship)
    for (let i = target; i <= length + target; i++) {
      if (ship.isHorizontal()) {
        grid[i][y].ship = ship
      } else {
        grid[x][i].ship = ship
      }
    }
  }

  function getPosition (x, y) {
    _isOnRange(x, y)
    return grid[x][y]
  }

  function getShipPartsInGrid (ship) {
    const shipParts = []
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid.length; y++) {
        const point = grid[x][y]
        const pointShip = point.ship
        if (pointShip && pointShip === ship) {
          shipParts.push({ x, y })
        }
      }
    }
    return shipParts
  }

  function getShipPartIndex (ship, x, y) {
    _isOnRange(x, y)
    const shipPartsLocations = getShipPartsInGrid(ship)
    const shipPartIndex = shipPartsLocations.findIndex(
      obj => obj.x === x && obj.y === y
    )
    return shipPartIndex
  }

  function receiveAttack (x, y) {
    _isOnRange(x, y)
    const point = grid[x][y]
    point.hitted = true
    const response = {
      hitted: true,
      ship: null
    }
    if (point.ship) {
      const partIndex = getShipPartIndex(point.ship, x, y)
      point.ship.hit(partIndex)
      response.ship = point.ship
      response.sunk = point.ship.isSunk()
    }
    return response
  }

  function isAllShipsSunk () {
    for (let x = 0; x < grid.length - 1; x++) {
      for (let y = 0; y < grid.length - 1; y++) {
        const point = grid[x][y]
        const pointShip = point.ship
        if (pointShip && pointShip.isSunk()) {
          continue
        } else if (!pointShip) {
          continue
        } else {
          return false
        }
      }
    }
    return true
  }

  return {
    isAllShipsSunk,
    placeShip,
    placeShipPart,
    getPosition,
    receiveAttack
  }
}
