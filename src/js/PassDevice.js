import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { createElement } from './utils'

const createPassDevicePage = player => {
  const name = player.object.getName()
  const container = createElement('section', null, 'pass-device', document.body)
  const text = createElement('p', 'pass-device-text', null, container)
  text.textContent = `Now it's ${name}'s turn. Pass device. The player ${name} should to click on button bellow.`
  const passButton = createElement(
    'button',
    'btn',
    'pass-device-btn',
    container
  )
  passButton.textContent = 'Device passed.'
  passButton.addEventListener('click', () => {
    container.remove()
    PubSub.publishSync(TOPIC.PING_SHOW_GAMEBOARD, player)
  })
}

function passDevice (topic, player) {
  createPassDevicePage(player)
}

PubSub.subscribe(TOPIC.PASS_DEVICE, passDevice)
