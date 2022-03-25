import { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import Mosaic from './Mosaic'
import Item, { TContainer } from './Item'
import { centercenter } from '../../styled/css'
import { LS_MY_WEAPON, LS_ELY } from '../../constants'
import './index.css'
import { getLSItem } from '../../utils/fn'
import { NIGHTMARE_WEAPONS } from './constants'

export interface Weapon {
  props: string[]
  weaponType: string
  job: string
}

interface WeaponItem extends Partial<Weapon>, TContainer {
}

const GenerateBtn = styled(Button)`
  margin-right: 20px;
`

const ItemTooltip = styled.div`
  display: flex;
  font-size: 12px;
`

const Container = styled.div`
  position: relative;
  width: 566px;
  margin-top: 20px;
  border: 1px solid rgb(221, 224, 209);
  border-radius: 15px;
  padding: 8px;
`

const Row = styled.div`
  display: flex;
  margin-bottom: 5px;
`

const NumberIndex = styled.div`
  ${centercenter}
  font-size: 12px;
  width: 21px;
  height: 38px;
  text-shadow: 0 2px 1px #333;
  color: white;
  background: linear-gradient(rgb(182, 200, 207), rgb(202, 217, 222));
  border-radius: 4px;
  margin-right: 8px;
`

const SquareWrapper = styled.div`
  position: relative;
`

const Square = styled.div`
  position: relative;
  border: 3px solid;
  border-left-color: rgb(210, 227, 234);
  border-top-color: rgb(210, 227, 234);
  border-right-color: rgb(225, 241, 243);
  border-bottom-color: rgb(225, 241, 243);
  background: rgb(240, 249, 251);
  width: 39px;
  height: 39px;
  border-radius: 10px;
  overflow: hidden;
`
/** 单个栏左上角四分之一圆，偏白色 */
const QuarterCircle = styled.div`
  position: absolute;
  left: -20%;
  top: -20%;
  background: rgb(247, 252, 253);
  width: 20px;
  height: 20px;
  border-radius: 50%;
`

const Bottom = styled.div`
  width: 550px;
  /* 暂时不开发道具栏滚动条，所以缩小宽度 */
  /* width: 564px; */
  height: 40px;
  border-radius: 4px;
  background: rgb(164, 192, 201);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7px;
  color: whitesmoke;
`

const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 0 22px 0 41px;
  background: linear-gradient(to right, rgb(82, 123, 135), rgb(84, 125, 137));
  border-radius: 2px;
  height: 29px;
`

const Ely = styled.div`
  width: 150px;
  height: 28px;
  background: linear-gradient(rgb(0, 2, 2), rgb(13, 71, 93));
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-right: 7px;
  color: rgb(255, 250, 117);
  border-radius: 2px;
`

const Index: React.FC = () => {
  const [ely] = useState<number>(getLSItem(LS_ELY, 19999999))
  const [mosaicIsShow, setMosaicIsShow] = useState(false)
  const [weaponMatrix, setWeaponMatrix] = useState<WeaponItem[][]>(getLSItem(LS_MY_WEAPON, Array(9).fill(Array(12))))

  const handleGenerate = useCallback(
    () => {
      for (let i = 0; i < weaponMatrix.length; i++) {
        for (let j = 0; j < weaponMatrix[i].length; j++) {
          // 从左到右，从上到下遍历，找到第一个空的位置
          if (!weaponMatrix[i][j]) {
            // 随机生成一个武器
            weaponMatrix[i][j] = {
              ...NIGHTMARE_WEAPONS['噩夢雙刀'],
              x: Math.floor(Math.random() * 15),
              y: Math.floor(Math.random() * 15)
            }
            localStorage.setItem(LS_MY_WEAPON, JSON.stringify(weaponMatrix))
            setWeaponMatrix(JSON.parse(JSON.stringify(weaponMatrix)))
            return
          }
        }
      }
    },
    [weaponMatrix]
  )

  const handleOpen = useCallback(
    () => {
      setMosaicIsShow(isShow => !isShow)
    },
    [],
  )
  /** 将金额格式化，每隔 4位添加一个逗号 */
  const formattedEly = useMemo(() => {
    let sEly = ely.toString()
    let result = ''

    while (sEly.length > 4) {
      result = ',' + sEly.slice(-4) + result
      sEly = sEly.slice(0, sEly.length - 4)
    }
    if (sEly) { result = sEly + result }

    return result
  }, [ely])

  return (
    <>
      <GenerateBtn type='primary' onClick={handleGenerate}>生成武器</GenerateBtn>
      <ItemTooltip>
        <Container>
          {Array(9).fill(0).map((_, idx) => (
            <Row key={idx}>
              <NumberIndex>{idx + 1}</NumberIndex>
              {Array(12).fill(0).map((_, squareIdx) => (
                <SquareWrapper key={squareIdx}>
                  <Square
                    className='square'
                    style={squareIdx && (squareIdx + 1) % 4 === 0 ? { marginRight: '13px' } : {}}
                  >
                    <QuarterCircle />
                  </Square>
                  {!!weaponMatrix[idx][squareIdx] && <Item x={weaponMatrix[idx][squareIdx].x} y={weaponMatrix[idx][squareIdx].y} />}
                </SquareWrapper>
              ))}
            </Row>
          ))}
          <Bottom>
            <div>
              <Option onClick={handleOpen}>道具强化</Option>
            </div>
            <Ely>{formattedEly}</Ely>
          </Bottom>
        </Container>
        {mosaicIsShow && <Mosaic />}
      </ItemTooltip>
    </>
  )
}

export default Index