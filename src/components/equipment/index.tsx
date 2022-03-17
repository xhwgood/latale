import { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import Mosaic from './Mosaic'
import { centercenter } from '../../styled/css'
import './index.css'

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

const Square = styled.div`
  position: relative;
  border: 2px solid;
  border-left-color: rgb(210, 227, 234);
  border-top-color: rgb(210, 227, 234);
  border-right-color: rgb(225, 241, 243);
  border-bottom-color: rgb(225, 241, 243);
  background: rgb(240, 249, 251);
  width: 38px;
  height: 38px;
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
  const [ely, setEly] = useState(19999999)
  const [mosaicIsShow, setMosaicIsShow] = useState(false)

  const handleGenerate = useCallback(
    () => {

    },
    []
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
      <Button type='primary' onClick={handleOpen}>道具强化</Button>
      <ItemTooltip>
        <Container>
          {Array(9).fill(0).map((_, idx) => (
            <Row>
              <NumberIndex>{idx + 1}</NumberIndex>
              {Array(12).fill(0).map((_, squareIdx) => (
                <Square
                  className='square'
                  style={squareIdx && (squareIdx + 1) % 4 == 0 ? { marginRight: '13px' } : {}}
                >
                  <QuarterCircle />
                </Square>
              ))}
            </Row>
          ))}
          <Bottom>
            <div>
              <Option>道具强化</Option>
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