import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { createElement } from './utils'

const createGameEndPage = winner => {
  const container = createElement('section', 'page', 'game-end', document.body)
  const trophy = createElement('p', 'trophy', null, container)
  trophy.textContent = '🏆'
  const text = createElement('p', 'page-text winner', null, container)

  if (winner === 'TIE') {
    text.textContent = 'There is a TIE!'
  } else {
    text.textContent = `The player ${winner.getName()} won the game!`
  }

  createElement('p', 'page-text', null, container).textContent =
    'Want to play again? Click on button bellow'

  const retryButton = createElement('button', 'btn page-btn', null, container)

  retryButton.textContent = 'Play again'
  retryButton.addEventListener('click', () => {
    container.remove()
    PubSub.publish(TOPIC.PING_SETUP_PLAYERS, {})
  })
}

function gameEnd (topic, winner) {
  createGameEndPage(winner)
}

PubSub.subscribe(TOPIC.GAME_END, gameEnd)
