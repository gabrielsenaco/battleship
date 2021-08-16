export function getRandomTrueFalse () {
  return Math.random() >= 0.5
}

export function objectsHaveSameKeys (...objects) {
  const allKeys = objects.reduce(
    (keys, object) => keys.concat(Object.keys(object)),
    []
  )
  const union = new Set(allKeys)
  return objects.every(object => union.size === Object.keys(object).length)
}

export function createElement (tag, className, id, parentNode = null) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (id) element.id = id
  if (parentNode) parentNode.appendChild(element)
  return element
}

export function getValidTopParentById (id, startNode, depth = 0) {
  return getValidTopParentByValidator(
    element => element.id && element.id.toUpperCase() === id.toUpperCase(),
    startNode,
    depth
  )
}

export function getValidTopParentByValidator (validator, startNode, depth = 0) {
  if (depth > 30) return null
  if (startNode && validator(startNode)) {
    return startNode
  }
  return getValidTopParentByValidator(validator, startNode.parentNode, ++depth)
}

export function getAdjacentsCoords (x, y, vertical, horizontal) {
  const adjacents = []

  if (horizontal) {
    adjacents.push([
      {
        x: x + 1,
        y
      },
      {
        x: x - 1,
        y
      }
    ])
  }

  if (vertical) {
    adjacents.push([
      {
        x,
        y: y + 1
      },
      {
        x,
        y: y - 1
      }
    ])
  }

  return adjacents.flat()
}
