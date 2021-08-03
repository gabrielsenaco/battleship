const ships = []

function _addNewShip (name, length) {
  ships.push({ name, length })
}

function _buildAllShips () {
  _addNewShip('Carrier', 5)
  _addNewShip('Battleship', 4)
  _addNewShip('Cruiser', 3)
  _addNewShip('Submarine', 3)
  _addNewShip('Destroyer', 2)
}

function getShipsByLength (length) {
  return ships.filter(ship => ship.length === length)
}

function getShip (name) {
  return ships.filter(ship => ship.name === name)[0]
}

function getShips () {
  return ships
}

_buildAllShips()

export { getShips, getShip, getShipsByLength }
