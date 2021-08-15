import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { createElement } from './utils'

const logDOM = createElement('p', 'hidden', 'log', document.body)
logDOM.addEventListener('click', () => logDOM.classList.add('hidden'))
let lastTimeoutLog

function sendMessage (message, type) {
  logDOM.textContent = message
  logDOM.setAttribute('data-type', type)
  logDOM.classList.remove('hidden')
  clearTimeout(lastTimeoutLog)
  lastTimeoutLog = setTimeout(() => logDOM.classList.add('hidden'), 5000)
}

function handleLog (topic, { message, type }) {
  sendMessage(message, type || 'info')
}

PubSub.subscribe(TOPIC.SEND_LOG, handleLog)
