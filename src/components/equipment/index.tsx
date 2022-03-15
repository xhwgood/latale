import styled from 'styled-components'
import { Button } from 'antd'
import Overview from './Overview'
import { useCallback } from 'react'

const Container = styled.div`
  width: 566px;
`

const Row = styled.div`
  display: flex;
  margin-bottom: 5px;
`

const NumberIndex = styled.div`
  display: flex;
`

const FourSquare = styled.div`
  
`

const Square = styled.div`
  position: relative;
  border: 7px;
  border: 1px solid #ccc;
`

const Index: React.FC = () => {
  const handleGenerate = useCallback(
    () => {

    },
    []
  )

  return (
    <>
      <Button type='primary' onClick={handleGenerate}>生成武器</Button>
      <Container>
        {Array(8).fill(0).map((_, idx) => (
          <Row>
            <NumberIndex>{idx}</NumberIndex>
            {Array(3).fill(0).map(_ => (
              <FourSquare>
                {Array(3).fill(0).map(_ => (
                  <Square></Square>
                ))}
              </FourSquare>
            ))}
          </Row>
        ))}
        <Overview />
      </Container>
    </>
  )
}

export default Index