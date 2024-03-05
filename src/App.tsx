import { useState, useCallback } from 'react'
import Equipment from './components/equipment/index'
import Memory from './components/memory/index'
import FourThousand from './components/4000/index'
import Box from './components/box/index'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { TabsProps } from 'rc-tabs'
import { LS_TAB_ACTIVE_KEY } from './constants'
import Coupon from './components/Coupon'

const ChromeTips = styled.div`
	margin-top: 5px;
	font-size: 18px;
	color: blue;
`

const Container = styled.div`
	margin: 0px 10px;
`

const { TabPane } = Tabs

function App() {
	const [activeKey, setActiveKey] = useState(
		localStorage.getItem(LS_TAB_ACTIVE_KEY) || '4000'
	)

	const handleChangeTabs = useCallback<Required<TabsProps>['onChange']>(
		activeKey => {
			setActiveKey(activeKey)
			localStorage.setItem(LS_TAB_ACTIVE_KEY, activeKey)
		},
		[]
	)

	return (
		<Container>
			<ChromeTips>建议使用Chrome最新版浏览器</ChromeTips>
			<Tabs defaultActiveKey={activeKey} onChange={handleChangeTabs}>
				<TabPane tab='4000 武器' key='4000'>
					<FourThousand />
				</TabPane>
				<TabPane tab='箱子数学期望计算器' key='box'>
					<Box />
				</TabPane>
				<TabPane tab='记忆' key='memory'>
					<Memory />
				</TabPane>
				<TabPane tab='优惠券' key='coupon'>
					<Coupon />
				</TabPane>
				{/* <TabPane tab="装备" key="equipment">
          <Equipment />
        </TabPane> */}
				{/* <TabPane tab="怪物掉落" key="monster">
          怪物掉落
        </TabPane> */}
			</Tabs>
		</Container>
	)
}

export default App
