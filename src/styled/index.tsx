import styled from 'styled-components'
import { Property } from 'csstype'
interface ICommonText {
  color?: string
  /** 默认左对齐 */
  align?: Property.TextAlign
}
/** 通用文本样式 */
export const CommonText = styled.div<ICommonText>`
  color: ${({ color }) => color || '#333'};
  text-align: ${({ align }) => align || 'left'};
  font-weight: bold;
`

export const SpaceAround = styled.div`
  display: flex;
  justify-content: space-around;
`

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`