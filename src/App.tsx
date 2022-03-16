import { useState, useCallback } from 'react'
import Equipment from './components/equipment/index'
import Memory from './components/memory/index'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { LS_TAB_ACTIVE_KEY } from './constants'

const ChromeTips = styled.div`
  font-size: 18px;
  color: blue;
`

const Container = styled.div`
  margin: 0px 10px;
`

const { TabPane } = Tabs

function App() {
  const [activeKey, setActiveKey] = useState(localStorage.getItem(LS_TAB_ACTIVE_KEY) || 'memory')

  const handleChangeTabs = useCallback(
    (key: string) => {
      setActiveKey(key)
      localStorage.setItem(LS_TAB_ACTIVE_KEY, key)
    },
    []
  )

  return (
    <Container>
      <ChromeTips>建议使用Chrome最新版浏览器</ChromeTips>
      <Tabs defaultActiveKey={activeKey} onChange={handleChangeTabs}>
        <TabPane tab="记忆" key="memory">
          <Memory />
        </TabPane>
        <TabPane tab="装备" key="equipment">
          <Equipment />
        </TabPane>
        <TabPane tab="怪物掉落" key="monster">
          怪物掉落
        </TabPane>
      </Tabs>
    </Container>
  )
}

export default App
