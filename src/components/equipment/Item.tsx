import { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { throttle } from '../../utils/fn'
import Overview from './Overview'

interface TContainer {
  x: number
  y: number
}

const Container = styled.div<TContainer>`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 35px;
  height: 35px;
  background: ${({ x, y }) => `url('./ITEMBATTLE_ICON12.PNG') no-repeat ${x * 35}px ${y * 35}px`};
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
      console.log(e.clientX, e.nativeEvent.offsetX)
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
      {/* {overviewIsShow && <Overview xOffset={overviewOffset.x} yOffset={overviewOffset.y} />} */}
    </Container>
  )
}

export default Item