import { useCallback, useMemo, memo } from 'react'
import styled from 'styled-components'
import { throttle } from '../../utils/fn'

export interface TContainer {
  x: number
  y: number
}

interface Props extends TContainer {
  setOverviewIsShow: React.Dispatch<React.SetStateAction<boolean>>
  setOverviewOffset: React.Dispatch<React.SetStateAction<{
    x: number
    y: number
  }>>
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

const Item: React.FC<Props> = ({ x, y, setOverviewIsShow, setOverviewOffset }) => {

  const handleMouseEnter = useCallback(
    () => {
      setOverviewIsShow(true)
    },
    [setOverviewIsShow]
  )

  const handleMouseMove = useMemo(() => {
    return throttle((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setOverviewOffset({
        x: e.clientX + 13,
        y: e.clientY + 13
      })
    }, 200)
  }, [setOverviewOffset])

  const handleMouseOut = useCallback(
    () => {
      setOverviewIsShow(false)
    },
    [setOverviewIsShow]
  )

  return (
    <Container x={x} y={y} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut} />
  )
}

export default memo(Item)