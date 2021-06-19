import sortBy from 'lodash.sortby'

const testing = {
	A: 1,
	B: 2
}
export const Result = {
	WIN: 1,
	LOSS: 2,
	TIE: 3
}

const FACE_VALUES = {
	'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
	'9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
}

const FACE_INDEX = 0
const SUIT_INDEX = 1

const getValueFaceMap = () => {
	const faceMap = new Map()
	const faceEntries = Object.entries(FACE_VALUES)
	faceEntries.forEach(([key, value]) => faceMap.set(value, key))
	
	return faceMap
}

const valueFaceMap = getValueFaceMap()

const isFlush = (cards) => cards.every(card => card[SUIT_INDEX] === cards[0][SUIT_INDEX])

const isStraight = (faceValues) => {
	const faceKeys = faceValues.map((faceValue => valueFaceMap.get(faceValue))).join('')
	
	return faceKeys === 'A5432' || faceValues.every((val, index) => (
		(val - 1 === faceValues[index + 1]) || (index === faceValues.length - 1)
	))
}

const getFaceCountMap = (faceValues) => {
	const faceMap = new Map()
	faceValues.forEach(face => faceMap.set(face, (faceMap.get(face) || 0) + 1))
	return faceMap
}

const getCountOfKindMap = (faceValues) => {
	const faceCountMap = getFaceCountMap(faceValues)
	const countOfKind = new Map()
	
	faceCountMap.forEach(faceCount => {
		countOfKind.set(faceCount, (countOfKind.get(faceCount) || 0) + 1)
	})
	
	return countOfKind
}

const getStringValue = (faceValues) => {
	const valueString = faceValues.map(val => val.toString().padStart(2, '0')).join('')
	return Number.parseInt(valueString)
}

const getHandRanking = ({cards, faceValues}) => {
	const straight = isStraight(faceValues)
	const flush = isFlush(cards)
	const countOfKindMap = getCountOfKindMap(faceValues)
	
	if (straight && flush) return 1 // royal flush
	if (countOfKindMap[4]) return 2 // four of a kind
	if (countOfKindMap[3] && countOfKindMap[2]) return 3 // full house
	if (flush) return 4
	if (straight) return 5
	if (countOfKindMap[3]) return 6 // three of a kind
	if (countOfKindMap[2] === 2) return 7 // two pairs
	if (countOfKindMap[2]) return 8 // one pair
	return 9
}

const getHandInfo = (hand) => {
	const cards = hand.split(' ')
	const faceValues = sortBy(cards.map(card => FACE_VALUES[ card[FACE_INDEX] ])).reverse()
	const handValue = getStringValue(faceValues)
	const handRank = getHandRanking({ cards, faceValues })
	
	return { handRank, handValue }
}

const comparePokerHands = (handA, handB) => {
	const infoA = getHandInfo(handA)
	const infoB = getHandInfo(handB)
	
	if (infoA.handRank < infoB.handRank) return Result.WIN
	if (infoA.handRank > infoB.handRank) return Result.LOSS
	
	if (infoA.handValue > infoB.handValue) return Result.WIN
	if (infoA.handValue < infoB.handValue) return Result.LOSS
	
	return Result.TIE
}

export default class PokerHand {
	constructor(hand) {
		this.hand = hand
	}
	
	compareWith = (other) => comparePokerHands(this.hand, other.hand)
}
