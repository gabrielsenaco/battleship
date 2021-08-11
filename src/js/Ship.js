export const Ship = (name, length, horizontal = true) => {
  const parts = _build()

  function _build () {
    const array = []
    for (let i = 0; i < length; i++) {
      array.push(false)
    }
    return array
  }

  function hit (position) {
    if (position < 0) { throw new Error('Invalid hit position number. Must be 0 or more') }
    if (position > length - 1) {
      throw new Error(
        'Invalid hit position. This number overflow the ship length.'
      )
    }
    parts[position] = true
    return true
  }

  function getName () {
    return name
  }

  function isSunk () {
    return getHits() === length
  }

  function getLength () {
    return parts.length
  }

  function getParts () {
    return parts
  }

  function getHits () {
    return parts.filter(part => part).length
  }

  function isHorizontal () {
    return horizontal
  }

  return {
    getLength,
    isHorizontal,
    getParts,
    hit,
    getHits,
    isSunk,
    getName
  }
}
