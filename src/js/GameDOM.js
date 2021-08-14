import PubSub from 'pubsub-js'
import { TOPIC } from './topics'

function handleStartGameConfirmation (topic, data) {
  if (data.started) document.body.setAttribute('game', 'started')
}

function handleGameEnd (topic, winner) {
  document.body.setAttribute('game', 'not started')
}

PubSub.subscribe(TOPIC.START_GAME_CONFIRMATION, handleStartGameConfirmation)
PubSub.subscribe(TOPIC.GAME_END, handleGameEnd)
