import { Player, ComputerPlayer } from './Player'
import { objectsHaveSameKeys } from './utils'

const _computerModel = ComputerPlayer()
const _playerModel = Player()

export function isValidPlayer (object) {
  return objectsHaveSameKeys(object, _playerModel)
}

export function isValidComputerPlayer (object) {
  return objectsHaveSameKeys(object, _computerModel)
}
