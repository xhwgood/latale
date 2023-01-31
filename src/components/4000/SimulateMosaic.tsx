import { Typography, InputNumber, Button, List, Radio, Switch } from 'antd'
import { useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import {
	WEAPON_DAMAGE_MAX,
	WEAPON_CRITICAL_MAX,
	WEAPON_STRENGTH_MAX,
	WEAPON_ATTACK_MAX,
	WEAPON_PENETRATION_MAX,
	SINGLE_COST
} from './constants'

interface ResultItem {
	/** 镶嵌成功次数 */
	successCount: number
	maxDamage: number
	criticalDamage: number
	/** 综合值 */
	compositeValue: number
	isSuccess: boolean
	/** 当前是第几件 */
	order: number
}

enum Filter {
	ALL,
	FAILED,
	SUCCESS
}

const ML = 10

const SuccessTip = styled.span`
	display: inline-block;
	margin-left: ${ML}px;
	color: red;
`

const MLSpan = styled.span`
	display: inline-block;
	margin-left: ${ML}px;
`

const Value = styled.span`
	color: #5858ff;
`

const { Title } = Typography

const Container = styled.div`
	margin-bottom: 20px;
`

const CountRow = styled.div`
	display: grid;
	grid-template-columns: 120px 200px;
	align-items: center;
	margin-bottom: 15px;
`

const AlignCenter = styled.div`
	display: flex;
	align-items: center;
`

const MosaicBtn = styled(Button)`
	display: block;
	margin-bottom: 10px;
`

const SimulateMosaic: React.FC = () => {
	const [count, setCount] = useState(100)
	const [filter, setFilter] = useState(Filter.ALL)
	const [checked, setChecked] = useState(false)
	// 镶嵌总次数
	const [totalCount, setTotalCount] = useState(0)
	// 镶嵌结果列表
	const [mosaicList, setMosaicList] = useState<ResultItem[]>([])
	const [maxAndCritical, setMaxAndCritical] = useState(210)

	const handleBegin = useCallback(() => {
		const l: ResultItem[] = []

		for (let i = 0; i < count; i++) {
			let successCount = 1
			const item = {
				maxDamage: 0,
				criticalDamage: 0
			}

			if (Math.random() < 0.45) {
				item.maxDamage = Math.ceil(Math.random() * WEAPON_DAMAGE_MAX)

				// 计算成功后的 大伤 + 爆伤最大值，是否大于期望的综合值
				// 如果小于的话就丢弃
				if (item.maxDamage + WEAPON_CRITICAL_MAX >= maxAndCritical) {
					successCount += 1
					if (Math.random() < 0.45) {
						item.criticalDamage = Math.ceil(Math.random() * WEAPON_CRITICAL_MAX)
					}
				}
			}

			const compositeValue = item.criticalDamage + item.maxDamage

			l.push({
				...item,
				successCount,
				compositeValue,
				isSuccess: compositeValue >= maxAndCritical && !!item.criticalDamage,
				order: i + 1
			})
			setTotalCount(p => p + successCount)
		}

		setMosaicList(l)
	}, [count, maxAndCritical])

	const filteredList = useMemo(() => {
		let l: ResultItem[] = []

		if (filter === Filter.ALL) {
			l = mosaicList
		}

		if (filter === Filter.FAILED) {
			l = mosaicList.filter(({ isSuccess }) => !isSuccess)
		}

		if (filter === Filter.SUCCESS) {
			l = mosaicList.filter(({ isSuccess }) => isSuccess)
		}

		if (checked) {
			return l.sort((a, b) => b.compositeValue - a.compositeValue)
		}

		return l
	}, [filter, mosaicList, checked])

	return (
		<Container>
			<Title level={3}>模拟镶嵌</Title>
			<CountRow>
				<span>模拟总武器数量：</span>
				<InputNumber
					addonAfter='件'
					value={count}
					min={1}
					max={100}
					onChange={v => setCount(v || 1)}
					style={{ width: 110 }}
				/>
			</CountRow>
			<AlignCenter>
				<span>大伤 + 爆伤低于</span>
				<InputNumber
					value={maxAndCritical}
					addonAfter='%'
					min={1}
					max={WEAPON_DAMAGE_MAX + WEAPON_CRITICAL_MAX}
					onChange={v => setMaxAndCritical(v || 1)}
					style={{ margin: '0 10px', width: 110 }}
				/>
				<span>丢弃</span>
			</AlignCenter>
			<MosaicBtn type='primary' onClick={handleBegin}>
				开始镶嵌
			</MosaicBtn>
			<Radio.Group
				value={filter}
				onChange={e => setFilter(e.target.value)}
				style={{ marginBottom: '10px' }}
			>
				<Radio value={Filter.ALL}>显示全部</Radio>
				<Radio value={Filter.SUCCESS}>仅显示成功结果</Radio>
				<Radio value={Filter.FAILED}>仅显示失败结果</Radio>
			</Radio.Group>
			<Switch
				checkedChildren='按综合值排序'
				unCheckedChildren='按综合值排序'
				checked={checked}
				onChange={v => setChecked(v)}
			/>
			<List
				size='small'
				header={<span>镶嵌结果</span>}
				footer={
					<span>
						一共镶嵌了：{totalCount} 次，成本为：{totalCount * SINGLE_COST} 亿
					</span>
				}
				bordered
				dataSource={filteredList}
				renderItem={({
					maxDamage,
					criticalDamage,
					isSuccess,
					compositeValue,
					order
				}) => (
					<List.Item>
						第 {order} 件：
						{maxDamage ? (
							<span>
								<span>
									大伤:<Value>{maxDamage}%</Value>
								</span>
								{criticalDamage ? (
									<span>
										<MLSpan>
											爆伤:<Value>{criticalDamage}%</Value>
										</MLSpan>
										{isSuccess && (
											<SuccessTip>
												镶嵌成功，综合值为{compositeValue}%
											</SuccessTip>
										)}
									</span>
								) : (
									<MLSpan>第二次镶嵌失败</MLSpan>
								)}
							</span>
						) : (
							<span>第一次镶嵌失败</span>
						)}
					</List.Item>
				)}
			/>
		</Container>
	)
}

export default SimulateMosaic
