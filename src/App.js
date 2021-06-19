import PokerHand from './PokerHand.js'

const hand1 = new PokerHand('AC 4D 5S 8C QH')
const hand2 = new PokerHand('4S 5S 8C AS JD')

const result = hand1.compareWith(hand2)

console.log({ result })