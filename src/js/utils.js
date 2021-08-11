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
