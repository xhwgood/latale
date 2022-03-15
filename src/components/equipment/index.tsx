import styled from 'styled-components'
import Overview from './Overview'

const Container = styled.div`
  width: 566px;
`

const Row = styled.div`
  display: flex;
`

const NumberIndex = styled.div`
  display: flex;
`

const Index: React.FC = () => {
  return (
    <Container>
      {Array(8).fill(0).map((_, idx) => (
        <Row>
          <NumberIndex>{idx}</NumberIndex>
        </Row>
      ))}
      <Overview />
    </Container>
  )
}

export default Index