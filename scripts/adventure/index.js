// @ts-check
import { cardList, multipleCardList, outGridGetCardList } from './constants.mjs'
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
  TRIGGER_TASK: 7,
  /** 获得声望 */
  GET_REPUTATION: 8,
}

/** 结束后储存的距离，从0开始，最终输出的时候需 +1 */
const finishDistance = []

/** 最小距离，从0开始，最终输出的时候需 +1 */
let minDistance = Infinity

/** 最大距离，从0开始，最终输出的时候需 +1 */
let maxDistance = 0

/** 总距离 */
let totalDistance = 0

/** 运行次数 */
const RUN_TIMES = 10000

/** 最多使用骰子次数 */
const MAX_DICE_NUM = 100

const begin = () => {
  /** 当前距离 */
  let currentDistance = 0
  /** 当前骰子次数 */
  let currentDiceCount = 0
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
    if (!_cardList.length && !_multipleCardList.length) {
      return
    }

    // 计算总卡牌数量
    const totalCards = _cardList.length + _multipleCardList.length
    // 生成一个随机数，范围是0到总卡牌数量-1
    const randomIndex = getRandom(0, totalCards - 1)

    // 根据随机数决定从哪个数组获取卡牌
    if (randomIndex < _cardList.length) {
      // 从普通卡牌数组中获取
      const cardIndex = getRandom(0, _cardList.length - 1)
      const card = _cardList.splice(cardIndex, 1)[0]
      console.log(chalk.red('剩余卡牌数量：', _cardList.length))
      ownCardList.push(card)
    } else {
      // 从倍数骰子数组中获取
      const multipleIndex = getRandom(0, _multipleCardList.length - 1)
      const multiple = _multipleCardList.splice(multipleIndex, 1)[0]
      console.log(chalk.red('剩余倍数骰子数量：', _multipleCardList.length))
      ownMultipleList.push(multiple)
    }
  }
  /**
   * 触发当前格子事件
   * @param {number} gridNum 当前在哪个格子
   */
  const triggerEvent = (gridNum) => {
    switch (gridEventType[gridNum]) {
      case EVENT_TYPE.CARD:
        // 卡牌事件不能在 outGridGetCardList 中的格子触发
        if (outGridGetCardList.includes(gridNum)) {
          console.log('当前格子不能触发卡牌事件')
          return
        }
        console.log('卡牌事件')
        if ((ownCardList.length + ownMultipleList.length) < 5) {
          getCard()
        }
        break
      case EVENT_TYPE.FORWARD:
        console.log('前进事件')
        currentDistance += gridEventValue[gridNum]
        console.log(chalk.green('管道前进到：', currentDistance))
        
        // 检查是否到达额外获得卡牌的格子
        if (outGridGetCardList.includes(currentDistance) && (ownCardList.length + ownMultipleList.length) < 5) {
          console.log(chalk.green('到达额外获得卡牌格子，获得一张卡牌'))
          getCard()
        }
        break
      case EVENT_TYPE.BACKWARD:
        console.log('后退事件')
        currentDistance -= gridEventValue[gridNum]
        console.log(chalk.blue('管道后退到：', currentDistance))
        break
    }
  }

  /** 使用卡牌 */
  const useCard = () => {
    if (!ownCardList.length && !ownMultipleList.length) {
      return
    }

    // 计算当前剩余骰子次数
    const remainingDice = MAX_DICE_NUM - currentDiceCount

    // 检查前方格子事件
    const checkNextGrids = (distance) => {
      const nextGridType = gridEventType[currentDistance + distance]
      return {
        type: nextGridType,
        value: gridEventValue[currentDistance + distance]
      }
    }

    // 检查前方是否有后退事件
    const checkBackwardEvent = (distance) => {
      for (let i = 1; i <= distance; i++) {
        const nextGrid = checkNextGrids(i)
        if (nextGrid.type === EVENT_TYPE.BACKWARD) {
          return {
            hasBackward: true,
            distance: i,
            value: nextGrid.value
          }
        }
      }
      return { hasBackward: false }
    }

    // 检查使用卡牌后是否能到达额外获得卡牌的格子
    const checkOutGridCard = (distance) => {
      const targetGrid = currentDistance + distance
      return outGridGetCardList.includes(targetGrid)
    }

    // 使用卡牌并触发事件
    const useCardAndTriggerEvent = (moveDistance) => {
      const oldDistance = currentDistance
      currentDistance += moveDistance
      // 触发事件
      triggerEvent(currentDistance)
      // 如果距离有变化，则再次触发事件
      if (oldDistance !== currentDistance) {
        triggerEvent(currentDistance)
      }
    }

    // 1. 优先处理后退事件
    const backwardCheck = checkBackwardEvent(12) // 检查最大可能的骰子数
    if (backwardCheck.hasBackward && backwardCheck.distance !== undefined) {
      // 尝试使用卡牌跳过后退事件
      for (let j = 0; j < ownCardList.length; j++) {
        const card = ownCardList[j]
        if (!card) continue
        
        // 如果使用卡牌后能跳过后退事件，且不会遇到新的后退事件
        if (card > backwardCheck.distance) {
          const newBackwardCheck = checkBackwardEvent(card - backwardCheck.distance)
          if (!newBackwardCheck.hasBackward) {
            console.log(chalk.green('使用卡牌', card, '跳过后退事件'))
            useCardAndTriggerEvent(card)
            ownCardList.splice(j, 1)
            return
          }
        }
      }

      // 如果有多倍卡牌，考虑使用
      if (ownMultipleList.length > 0) {
        const maxMultiple = Math.max(...ownMultipleList)
        const minPossibleDistance = maxMultiple * 2 // 假设最小骰子数为2
        if (minPossibleDistance > backwardCheck.distance) {
          const multipleIndex = ownMultipleList.indexOf(maxMultiple)
          const multiple = ownMultipleList.splice(multipleIndex, 1)[0]
          const diceNum = getRandom(2, 12)
          const moveDistance = diceNum * multiple
          // 检查使用倍数卡牌后是否会遇到后退事件
          const newBackwardCheck = checkBackwardEvent(moveDistance - backwardCheck.distance)
          if (!newBackwardCheck.hasBackward) {
            console.log(chalk.green('使用倍数卡牌', multiple, '前进', moveDistance, '格'))
            useCardAndTriggerEvent(moveDistance)
            return
          }
        }
      }
    }

    // 2. 游戏后期策略（最后30个骰子）
    if (remainingDice <= 30) {
      // 优先使用高倍数卡牌
      if (ownMultipleList.length > 0) {
        const maxMultiple = Math.max(...ownMultipleList)
        const multipleIndex = ownMultipleList.indexOf(maxMultiple)
        const multiple = ownMultipleList.splice(multipleIndex, 1)[0]
        
        const diceNum = getRandom(2, 12)
        const moveDistance = diceNum * multiple
        
        // 检查使用倍数卡牌后是否会遇到后退事件
        const newBackwardCheck = checkBackwardEvent(moveDistance)
        if (!newBackwardCheck.hasBackward) {
          // 检查是否能到达额外获得卡牌的格子
          if (checkOutGridCard(moveDistance)) {
            useCardAndTriggerEvent(moveDistance)
            return
          }
          // 即使不能到达额外获得卡牌格子，只要不会遇到后退事件就使用
          useCardAndTriggerEvent(moveDistance)
          return
        }
      }

      // 使用前进卡牌
      for (let j = 0; j < ownCardList.length; j++) {
        const card = ownCardList[j]
        if (!card || card <= 0) continue
        
        // 检查使用卡牌后是否会遇到后退事件
        const newBackwardCheck = checkBackwardEvent(card)
        if (!newBackwardCheck.hasBackward) {
          // 检查是否能到达前进事件
          const nextGrid = checkNextGrids(card)
          if (nextGrid.type === EVENT_TYPE.FORWARD) {
            useCardAndTriggerEvent(card)
            ownCardList.splice(j, 1)
            return
          }
          
          // 检查是否能到达额外获得卡牌的格子
          if (checkOutGridCard(card)) {
            useCardAndTriggerEvent(card)
            ownCardList.splice(j, 1)
            return
          }
        }
      }
    }

    // 3. 检查是否能到达前进事件
    for (let j = 0; j < ownCardList.length; j++) {
      const card = ownCardList[j]
      if (!card) continue
      
      const nextGrid = checkNextGrids(card)
      
      if (nextGrid.type === EVENT_TYPE.FORWARD) {
        // 检查使用卡牌后是否会遇到后退事件
        const newBackwardCheck = checkBackwardEvent(card)
        if (!newBackwardCheck.hasBackward) {
          useCardAndTriggerEvent(card)
          ownCardList.splice(j, 1)
          return
        }
      }
    }

    // 4. 检查是否能到达额外获得卡牌的格子
    for (let j = 0; j < ownCardList.length; j++) {
      const card = ownCardList[j]
      if (!card || card <= 0) continue
      
      // 检查使用卡牌后是否会遇到后退事件
      const newBackwardCheck = checkBackwardEvent(card)
      if (!newBackwardCheck.hasBackward && checkOutGridCard(card)) {
        useCardAndTriggerEvent(card)
        ownCardList.splice(j, 1)
        return
      }
    }
  }

  for (let i = 0; i < MAX_DICE_NUM; i++) {
    currentDiceCount = i
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

// 运行多次并统计结果
console.log(chalk.blue('开始运行', RUN_TIMES, '次...'))
for (let i = 0; i < RUN_TIMES; i++) {
  const distance = begin()
  finishDistance.push(distance)
  totalDistance += distance
  minDistance = Math.min(minDistance, distance)
  maxDistance = Math.max(maxDistance, distance)

  // 每1000次输出一次进度
  if ((i + 1) % 1000 === 0) {
    console.log(chalk.green('已完成', i + 1, '次运行'))
  }
}

// 计算平均值
const averageDistance = totalDistance / RUN_TIMES

// 输出统计结果
console.log(chalk.yellow('\n统计结果：'))
console.log(chalk.yellow('运行次数：', RUN_TIMES))
console.log(chalk.yellow('最远距离：', maxDistance))
console.log(chalk.yellow('最近距离：', minDistance))
console.log(chalk.yellow('平均距离：', averageDistance.toFixed(2)))

// 计算距离分布
const distanceDistribution = {}
finishDistance.forEach(distance => {
  const range = Math.floor(distance / 10) * 10
  distanceDistribution[range] = (distanceDistribution[range] || 0) + 1
})

// 输出距离分布
console.log(chalk.yellow('\n距离分布：'))
Object.keys(distanceDistribution)
  .sort((a, b) => Number(a) - Number(b))
  .forEach(range => {
    const count = distanceDistribution[range]
    const percentage = (count / RUN_TIMES * 100).toFixed(2)
    console.log(chalk.yellow(`${range}-${Number(range) + 9}格：${count}次 (${percentage}%)`))
  })