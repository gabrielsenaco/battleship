import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import { getRandomTrueFalse } from './utils'
import { isValidPlayer, isValidComputerPlayer } from './PlayerValidator'
import { PlayerGame } from './PlayerDOM'
import { fetchPlayerOption } from './PlayerOptionController'

export default function init (playerList) {
  if (playerList.length !== 2) {
    throw new Error('Invalid player length. It only takes two players.')
  }
  const players = []

  for (const player of playerList) {
    if (!player) throw new Error('Cannot use player with falsy value.')
    const isBot = isValidComputerPlayer(player)
    const isPlayer = isValidPlayer(player)
    if (!isBot && !isPlayer) throw new Error('Invalid player type.')
    const gameboard = player.getGameboard()
    if (!gameboard) throw new Error('Invalid Gameboard type.')
    const ships = gameboard.getShipsPoints()
    if (ships.length !== 5) {
      throw new Error('Invalid Ships length. Required: 5 differents ships')
    }
    const playerGame = PlayerGame(player, isBot)
    players.push(playerGame)
  }

  loopGame(players[0], players[1], null, 0)
}

async function loopGame (
  player1,
  player2,
  lastPlayerTurn,
  steps,
  winner = false
) {
  if (winner) return
  if (!lastPlayerTurn) {
    lastPlayerTurn = getRandomTrueFalse() ? player1 : player2
  }
  console.log('Game Looping....', { player1, player2, lastPlayerTurn, steps })

  const playerTurn = lastPlayerTurn === player1 ? player2 : player1
  let playerOptionResponse

  if (someIsBot(playerTurn, lastPlayerTurn)) {
    PubSub.publishSync(TOPIC.PING_SHOW_GAMEBOARD, playerTurn)
  }
  PubSub.publishSync(TOPIC.PING_HIDE_GAMEBOARD, lastPlayerTurn)

  if (steps > 0) passDevice(playerTurn, lastPlayerTurn)

  if (playerTurn.bot) {
    const { x, y } = playerTurn.object.betterAttack()
    playerOptionResponse = { x, y, object: playerTurn }
  } else {
    playerOptionResponse = await fetchPlayerOption(playerTurn.object)
  }

  attackGameboard(playerTurn, lastPlayerTurn, playerOptionResponse)
  updateGameboards(playerTurn, lastPlayerTurn)

  const winnerResponse = getWinner(player1.object, player2.object)
  if (winnerResponse === 'TIE') {
    alert('TIE GAME!' + winnerResponse)
    return
  } else if (winnerResponse !== null) {
    console.log(winnerResponse)
    alert('HAS WINNER HERE!' + winnerResponse.getName())
    return
  }

  lastPlayerTurn = playerTurn
  setTimeout(() => loopGame(player1, player2, lastPlayerTurn, ++steps), 1000)
}

function getWinner (player1, player2) {
  const player1AllShipsSunk = player1.getGameboard().isAllShipsSunk()
  const player2AllShipsSunk = player2.getGameboard().isAllShipsSunk()
  if (player1AllShipsSunk && player2AllShipsSunk) return 'TIE'

  if (player1AllShipsSunk) return player2
  if (player2AllShipsSunk) return player1

  return null
}

function someIsBot (player1, player2) {
  return player1.bot || player2.bot
}

function attackGameboard (playerTurn, lastPlayerTurn, playerOptionResponse) {
  const attackResponse = lastPlayerTurn.object
    .getGameboard()
    .receiveAttack(playerOptionResponse.x, playerOptionResponse.y)
  playerTurn.object.attack(attackResponse, attackResponse.x, attackResponse.y)
}

function updateGameboards (playerTurn, lastPlayerTurn) {
  PubSub.publish(TOPIC.UPDATE_GAMEBOARD, {
    gameboard: lastPlayerTurn.object.getGameboard(),
    gameboardDOM: lastPlayerTurn.gameboardDOM
  })
  PubSub.publish(TOPIC.UPDATE_GAMEBOARD, {
    gameboard: playerTurn.object.getEnemyGameboard(),
    gameboardDOM: playerTurn.enemyGameboardDOM
  })
}

function passDevice (playerTurn, lastPlayerTurn, valid) {
  if (!someIsBot(playerTurn, lastPlayerTurn)) {
    PubSub.publishSync(TOPIC.PASS_DEVICE, playerTurn)
  }
}
