import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import Overview from './Overview'
import Mosaic from './Mosaic'
import { centercenter } from '../../styled/css'
import './index.css'

const GenerateBtn = styled(Button)`
  margin-right: 20px;
`

const ItemTooltip = styled.div`
  display: flex;
`

const Container = styled.div`
  position: relative;
  width: 566px;
  margin-top: 20px;
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

const FourSquare = styled.div`
  display: flex;
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
`

const Index: React.FC = () => {
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

  return (
    <>
      <GenerateBtn type='primary' onClick={handleGenerate}>生成武器</GenerateBtn>
      <Button type='primary' onClick={handleOpen}>道具强化</Button>
      <ItemTooltip>
        <Container>
          {Array(8).fill(0).map((_, idx) => (
            <Row>
              <NumberIndex>{idx + 1}</NumberIndex>
              {Array(3).fill(0).map(_ => (
                <FourSquare className='four-square'>
                  {Array(4).fill(0).map(_ => (
                    <Square className='square'></Square>
                  ))}
                </FourSquare>
              ))}
            </Row>
          ))}
          <Overview />
        </Container>
        {mosaicIsShow && <Mosaic />}
      </ItemTooltip>
    </>
  )
}

export default Index