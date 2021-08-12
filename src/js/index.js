import PubSub from 'pubsub-js'
import { TOPIC } from './topics'
import '../css/styles.css'
import './PassDevice'
import './Game'
import './PlayerSetup'
import './ShipSetup'

PubSub.publish(TOPIC.PING_SETUP_PLAYERS, {})
