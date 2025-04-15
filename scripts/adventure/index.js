// @ts-check
import { cardList, multipleCardList } from './constants.mjs'
import { getRandom } from '../common.mjs'
import gridEventType from './gridEventType.mjs'
import gridEventValue from './gridEventValue.mjs'
import { WHEN_NUM_GREATER, MAX_BACK_OBTAIN_DICE } from './config.mjs'
import chalk from 'chalk'

/** 事件类型 */
const EVENT_TYPE = {
  /** 空 */
  EMPTY: 0,
  /** 获得卡牌 */
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

const begin = () => {
  /** 当前距离 */
  let currentDistance = 0
  /** 
   * 拥有的卡牌，合计最多持有5张
   * @type {number[]}
   */
  const ownCardList = []
  /** 
   * 拥有的倍数骰子卡牌，合计最多持有5张
   * @type {number[]}
   */
  const ownMultipleList = []
  /** 所有卡牌不会重复获得，所以需要一个副本 */
  const _cardList = [...cardList]
  /** 所有倍数骰子不会重复获得，所以需要一个副本 */
  const _multipleCardList = [...multipleCardList]

  /** 获取卡牌 */
  const getCard = () => {
    if (!_cardList.length) {
      return
    }
    const cardIndex = getRandom(0, _cardList.length - 1)
    const card = _cardList.splice(cardIndex, 1)[0]
    console.log(chalk.red('剩余卡牌数量：', _cardList.length))

    ownCardList.push(card)
  }
  /** 获取倍数骰子 */
  const getMultiple = () => {
    if (!_multipleCardList.length) {
      return
    }
    const multipleIndex = getRandom(0, _multipleCardList.length - 1)
    const multiple = _multipleCardList.splice(multipleIndex, 1)[0]
    console.log(chalk.red('剩余倍数骰子数量：', _multipleCardList.length))

    ownMultipleList.push(multiple)
  }
  /**
   * 触发当前格子事件
   * @param {number} gridNum 当前在哪个格子
   */
  const triggerEvent = (gridNum) => {
    switch (gridEventType[gridNum]) {
      case EVENT_TYPE.CARD:
        console.log('卡牌事件')

        if ((ownCardList.length + ownMultipleList.length) < 5) {
          getCard()
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

        if ((ownCardList.length + ownMultipleList.length) < 5) {
          getMultiple()
        }
        break
    }
  }

  /** 使用卡牌 */
  const useCard = () => {
    if (!ownCardList.length && !ownMultipleList.length) {
      return
    }
    // 使用倍数骰子如果能跳过后退格子的话，则使用倍数骰子
    // if (ownMultipleList.length) {
    //   const multipleGridList = ownMultipleList.map(m => m * 2)
    //   return
    // }
    /** 使用卡牌到达格子后的格子类型 */
    const cardDistanceType = ownCardList.map(c => gridEventType[c + currentDistance])

    // 倍数骰子的收益大致在 2~12格（平均7格），能获得倍数骰子的话直接使用这张卡
    const multipleIndex = cardDistanceType.findIndex(c => c === EVENT_TYPE.GET_MULTIPLE)
    if (multipleIndex !== -1) {
      const forwardNum = ownCardList[multipleIndex]
      console.log(`使用卡牌来获得倍数骰子，前进${forwardNum}格`)

      ownCardList.splice(multipleIndex, 1)
      getMultiple()
      return
    }
    /** 可以前进前进的卡牌索引列表 */
    const forwardList = []
    cardDistanceType.forEach((c, index) => {
      if (c === EVENT_TYPE.FORWARD) {
        forwardList.push(index)
      }
    })
    if (!forwardList.length) {
      return
    }
    // if (currentDistance+) {

    // }
  }

  for (let i = 0; i < MAX_DICE_NUM; i++) {
    console.log(chalk.green('——————————————第', i + 1, '次掷骰子——————————————'))
    // 掷骰子前判断要不要使用卡牌
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