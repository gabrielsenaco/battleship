import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { buildGameboardDOMByModel } from './GameboardDOM'

export const PlayerGame = (object, bot) => {
  const enemyGameboardDOM = buildGameboardDOMByModel(
    false,
    true,
    object.getEnemyGameboard(),
    null
  )

  let gameboardDOM
  if (!bot) {
    gameboardDOM = buildGameboardDOMByModel(
      false,
      false,
      object.getGameboard(),
      object.getName()
    )
    enemyGameboardDOM.grid.addEventListener(
      'click',
      listenToGameboardClick.bind(event, object)
    )
  }

  return {
    object,
    bot,
    gameboardDOM,
    enemyGameboardDOM
  }
}

function listenToGameboardClick (object, event) {
  const item = event.target
  if (item.hasAttribute('data-x') && item.hasAttribute('data-y')) {
    const x = parseInt(item.getAttribute('data-x'))
    const y = parseInt(item.getAttribute('data-y'))
    PubSub.publishSync(TOPIC.SET_PLAYER_OPTION, {
      x,
      y,
      object
    })
  }
}
