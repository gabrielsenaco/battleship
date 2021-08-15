import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { createElement } from './utils'
import { Player, ComputerPlayer } from './Player'

const createPlayerSetupForm = listener => {
  let form

  function _removeOldForms () {
    Array.from(document.querySelectorAll('#setup-players')).forEach(element =>
      element.remove()
    )
  }

  function _removeOldGameboard () {
    const element = document.getElementById('gameboards')
    if (element) element.remove()
  }

  function _build () {
    _removeOldForms()
    _removeOldGameboard()
    form = createElement('form', null, 'setup-players', null)
    document.body.insertBefore(
      form,
      document.body.children[0].nextElementSibling || document.body.children[0]
    )
    _buildPlayerSetup(form)
    _buildStartGame(form)
  }

  function _buildPlayerSetup (parentNode) {
    const title = createElement('h2', 'title', null, parentNode)
    title.textContent = 'Players'

    const players = createElement('ol', null, null, parentNode)

    for (let i = 1; i <= 2; i++) {
      const item = createElement('li', null, null, players)
      const playerName = `player-${i}-name`
      const playerBot = `player-${i}-bot`
      const labelName = createElement('label', 'player-label', null, item)
      labelName.setAttribute('for', playerName)
      labelName.textContent = 'Username'
      const inputName = createElement('input', null, null, item)
      inputName.setAttribute('type', 'text')
      inputName.setAttribute('name', playerName)
      inputName.setAttribute('id', playerName)
      inputName.setAttribute('placeholder', 'Insert player name here.')
      inputName.setAttribute('required', '')
      const labelBot = createElement('label', null, null, item)
      labelBot.setAttribute('for', playerBot)
      labelBot.textContent = 'Bot'
      const inputBot = createElement('input', null, null, labelBot)
      inputBot.setAttribute('type', 'checkbox')
      inputBot.setAttribute('name', playerBot)
      inputBot.setAttribute('id', playerBot)
    }
  }

  function _buildStartGame (parentNode) {
    const title = createElement('h3', 'subtitle', null, parentNode)
    title.textContent = 'Start game'
    const button = createElement('button', 'btn confirm-form', null, parentNode)
    button.setAttribute('type', 'submit')
    button.textContent = 'Start game'
  }

  _build()
  form.addEventListener('submit', listener)
  return form
}

function setupPlayers (event) {
  const elements = event.target.elements
  const playerList = []
  const formPlayers = [
    {
      name: elements['player-1-name'].value,
      bot: elements['player-1-bot'].checked
    },
    {
      name: elements['player-2-name'].value,
      bot: elements['player-2-bot'].checked
    }
  ]
  for (const player of formPlayers) {
    playerList.push(buildPlayer(player.name, player.bot))
  }
  PubSub.publish(TOPIC.SETUP_SHIPS, playerList)
  event.preventDefault()
  event.target.remove()
}

function buildPlayer (name, bot) {
  const type = bot ? ComputerPlayer : Player
  return type(name)
}

function startSetupPlayers () {
  createPlayerSetupForm(setupPlayers)
}

PubSub.subscribe(TOPIC.PING_SETUP_PLAYERS, startSetupPlayers)
