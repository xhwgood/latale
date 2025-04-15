// @ts-check
import { cardList } from './constants.mjs'
import { getRandom } from '../common.mjs'
import gridEventType from './gridEventType.mjs'
import gridEventValue from './gridEventValue.mjs'
import chalk from 'chalk'

/** 事件类型 */
const EVENT_TYPE = {
  /** 空 */
  EMPTY: 0,
  /** 获得卡片 */
  CARD: 1,
  /** BOSS */
  BOSS: 2,
  /** 任务 */
  TASK: 4,
  /** 前进 */
  FORWARD: 5,
  /** 后退 */
  BACKWARD: 6,
  /** 获得倍数骰子 */
  GET_MULTIPLE: 7,
  /** 获得声望 */
  GET_REPUTATION: 8,
}

/** 结束后储存的距离，从0开始，最终输出的时候需 +1 */
const finishDistance = []

/** 最小距离，从0开始，最终输出的时候需 +1 */
let minDistance = 0

/** 最大距离，从0开始，最终输出的时候需 +1 */
let maxDistance = 0

/** 最多使用骰子次数 */
const MAX_DICE_NUM = 100
/** 当使用骰子数前进的格子大于这个数时，使用卡牌 */
const WHEN_NUM_GREATER = 10

const begin = () => {
  /** 当前距离 */
  let currentDistance = 0
  /** 
   * 拥有的卡片，最多持有5张
   * @type {number[]}
   */
  const ownCardList = []
  /** 所有卡牌不会重复活动，所以需要一个副本 */
  const _cardList = [...cardList]

  /**
   * 触发当前格子事件
   * @param {number} gridNum 当前在哪个格子
   */
  const triggerEvent = (gridNum) => {
    switch (gridEventType[gridNum]) {
      case EVENT_TYPE.CARD:
        console.log('卡牌事件')

        if (ownCardList.length < 5) {
          const cardIndex = getRandom(0, _cardList.length - 1)
          const card = _cardList.splice(cardIndex, 1)[0]
          console.log(chalk.red('剩余卡牌：', _cardList, '；卡牌数量：', _cardList.length))

          ownCardList.push(card)
        }
        break
      case EVENT_TYPE.FORWARD:
        console.log('前进事件')

        currentDistance += gridEventValue[gridNum]
        console.log(chalk.green('管道前进到：', currentDistance))

        break
      case EVENT_TYPE.BACKWARD:
        console.log('后退事件')

        currentDistance -= gridEventValue[gridNum]
        console.log(chalk.blue('管道后退到：', currentDistance))
        break
      case EVENT_TYPE.GET_MULTIPLE:
        console.log('获得倍数骰子事件')

        if (ownCardList.length < 5) {
          // const cardIndex = getRandom(0, _cardList.length - 1)
          // const card = _cardList.splice(cardIndex, 1)[0]
          // console.log(chalk.red('剩余卡牌：', _cardList, '；卡牌数量：', _cardList.length))

          // ownCardList.push(card)
        }
        break
    }
  }

  /** 使用卡牌 */
  const useCard = () => {
    if (!ownCardList.length) {
      return
    }
    /** 使用卡牌后，可以前进/后退的格子类型 */
    const cardDistanceType = ownCardList.map(c => gridEventType[c + currentDistance])
    // if (currentDistance+) {

    // }
  }

  for (let i = 0; i < MAX_DICE_NUM; i++) {
    console.log(chalk.green('——————————————第', i + 1, '次掷骰子——————————————'))
    useCard()
    // 掷骰子
    const diceNum = getRandom(2, 12)
    console.log(chalk.green(`骰子: ${diceNum}`))

    // 移动
    currentDistance += diceNum
    /** 保存下当前距离 */
    const _distance = currentDistance
    console.log(`移动到: ${currentDistance}`)
    // 触发事件
    triggerEvent(currentDistance)
    // 触发事件后，如果距离有变化，则再次触发事件
    if (_distance !== currentDistance) {
      triggerEvent(currentDistance)
    }
  }
  console.log('currentDistance:', currentDistance)
  return currentDistance
}
begin()

// for (let i = 0; i < 1000; i++) {

// }