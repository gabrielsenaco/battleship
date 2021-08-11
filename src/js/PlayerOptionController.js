import PubSub from 'pubsub-js'
import { TOPIC } from './topics'

let playerOption = {
  x: null,
  y: null,
  object: null
}

function _setPlayerOption (topic, data) {
  playerOption = data
}

function _clearPlayerOption () {
  playerOption = {
    x: null,
    y: null,
    object: null
  }
}

export async function fetchPlayerOption (playerObjectExpect) {
  return new Promise((resolve, reject) => {
    function waitResponse () {
      _clearPlayerOption()
      setTimeout(() => {
        if (
          playerOption.object &&
          playerOption.y !== null &&
          playerOption.x !== null
        ) {
          if (playerOption.object !== playerObjectExpect) {
            return waitResponse()
          }
          const option = playerOption
          _clearPlayerOption()
          return resolve(option)
        }
        return waitResponse()
      }, 100)
    }
    waitResponse()
  })
}

PubSub.subscribe(TOPIC.SET_PLAYER_OPTION, _setPlayerOption)
