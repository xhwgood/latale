import { memo } from 'react'
import styled from 'styled-components'
import { NIGHTMARE_DEFAULT, NIGHTMARE_WEAPONS } from './constants'
import { CommonText } from '../../styled'

interface Props {
  offsetX?: number
  offsetY?: number
  isShow: boolean
}

const Container = styled.div<Required<Props>>`
  border: 1px rgb(101, 97, 168) solid;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  position: absolute;
  background: white;
  left: ${({ offsetX }) => `${offsetX}px`};
  top: ${({ offsetY }) => `${offsetY}px`};
  font-size: 10px;
  line-height: 14px;
  white-space: nowrap;
  z-index: 10;
  visibility: ${({ isShow }) => isShow ? 'visible' : 'hidden'};
`

const LimitInfo = styled.div`
  margin-bottom: 10px;
`
const WeaponProps = styled.div`
`
const ExtraProps = styled.div`
  margin-top: 10px;
`
const testName = '噩夢雙刀'
/** 装备预览 */
const Overview: React.FC<Props> = ({ offsetX = 40, offsetY = 40, isShow }) => {
  return (
    <Container offsetX={offsetX} offsetY={offsetY} isShow={isShow}>
      <CommonText color='#ff75bc' align='center'>{testName}</CommonText>
      <CommonText color='#6d6d6d' align='center'>[战斗装备-{NIGHTMARE_WEAPONS[testName].weaponType}]</CommonText>
      <LimitInfo>
        <CommonText color='#da5555'>职业: {NIGHTMARE_WEAPONS[testName].job}</CommonText>
        <CommonText color='#b42b45'>需要超越等级: Lv.1800▲</CommonText>
        <CommonText color='#4b4b4b'>限制等级: 235▲</CommonText>
        <CommonText color='#00f'>佩戴可能等级: 235▲</CommonText>
        <CommonText color='#666'>强化耐久度: 26</CommonText>
        <CommonText color='#666'>镶嵌属性可能等级: 20</CommonText>
        <CommonText color='#ff75bc'>可封印次数(+ 1次)</CommonText>
        <CommonText color='#1d747c'>可分解</CommonText>
      </LimitInfo>
      <WeaponProps>
        {NIGHTMARE_WEAPONS[testName].props?.map(item => (
          <CommonText key={item}>{item}</CommonText>
        ))}
        {NIGHTMARE_DEFAULT.map(item => (
          <CommonText key={item}>{item}</CommonText>
        ))}
      </WeaponProps>
      <ExtraProps></ExtraProps>
    </Container>
  )
}

export default memo(Overview)