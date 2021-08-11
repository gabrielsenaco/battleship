import '../css/styles.css'
import './PassDevice'
import init from './Game'
import { Player, ComputerPlayer } from './Player'
import { getShips } from './Ships'
import './PlayerSetup'
import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
/*
  TO-DO
  [ ] 1. SETUP DOS PLAYERS: NOMES E SE É BOT OU NÃO
  [ ] 2. SETUP DO ESQUEMA DA GAMEBOARD
  --APÓS ISSO, CHAMAR A FUNÇÃO #INIT DO MÓDULO INIT COM A LISTA DOS DOIS PLAYERS.
*/
PubSub.publish(TOPIC.PING_SETUP_PLAYERS, {})
const player1 = ComputerPlayer('James')
const player2 = ComputerPlayer('Pro') // ComputerPlayer
player1.buildGameboardScheme(getShips())
player2.buildGameboardScheme(getShips())
const playerList = [player1, player2]

init(playerList)
// let data = buildGameboardDOMByModel(false, player1.getGameboard())
// markPointInGrid(4,4, data.grid)
