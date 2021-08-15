import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { createElement } from './utils'

const createPassDevicePage = player => {
  const name = player.object.getName()
  const container = createElement(
    'section',
    'page',
    'pass-device',
    document.body
  )
  createElement(
    'p',
    'page-text',
    null,
    container
  ).textContent = `Now it's ${name}'s turn. Pass the device to him/her.`
  createElement('p', 'page-text', null, container).textContent =
    'It is necessary for the player to confirm by clicking the button below.'
  const passButton = createElement('button', 'btn page-btn', null, container)
  passButton.textContent = 'Device passed to me'
  passButton.addEventListener('click', () => {
    container.remove()
    PubSub.publishSync(TOPIC.PING_SHOW_GAMEBOARD, player)
  })
}

function passDevice (topic, player) {
  createPassDevicePage(player)
}

PubSub.subscribe(TOPIC.PASS_DEVICE, passDevice)
