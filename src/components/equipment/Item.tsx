import { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { throttle } from '../../utils/fn'
import Overview from './Overview'

export interface TContainer {
  x: number
  y: number
}

const sideLength = 32

const Container = styled.div<TContainer>`
  position: absolute;
  display: inline-block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: ${sideLength}px;
  height: ${sideLength}px;
  background: ${({ x, y }) => `url('${process.env.PUBLIC_URL}/img/ITEMBATTLE_ICON12.PNG') no-repeat -${x * sideLength}px -${y * sideLength}px`};
`

const Item: React.FC<TContainer> = ({ x, y }) => {
  const [overviewIsShow, setOverviewIsShow] = useState(false)
  const [overviewOffset, setOverviewOffset] = useState({
    x: 0,
    y: 0
  })

  const handleMouseEnter = useCallback(
    () => {
      setOverviewIsShow(true)
    },
    []
  )

  const handleMouseMove = useMemo(() => {
    return throttle((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const { offsetX, offsetY } = e.nativeEvent
      // setOverviewOffset({
      //   x: offsetX + 20,
      //   y: offsetY + 20
      // })
    })
  }, [])

  const handleMouseOut = useCallback(
    () => {
      setOverviewIsShow(false)
    },
    []
  )

  return (
    <Container x={x} y={y} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
      {overviewIsShow && <Overview offsetX={overviewOffset.x} offsetY={overviewOffset.y} />}
    </Container>
  )
}

export default Item