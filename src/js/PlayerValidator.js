import { Player, ComputerPlayer } from './Player'
import { objectsHaveSameKeys } from './utils'

const _computerModel = ComputerPlayer()
const _playerModel = Player()

export function isValidPlayer (object) {
  if (!object) return false
  return objectsHaveSameKeys(object, _playerModel)
}

export function isValidComputerPlayer (object) {
  if (!object) return false
  return objectsHaveSameKeys(object, _computerModel)
}

export function isAllPlayer (players) {
  return _isAll(players, isValidPlayer)
}

export function isAllComputerPlayer (players) {
  return _isAll(players, isValidComputerPlayer)
}

function _isAll (players, validator) {
  return players.every(player => validator(player))
}
