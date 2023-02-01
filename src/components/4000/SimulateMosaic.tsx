import { Typography, InputNumber, Button, Radio, Form } from 'antd'
import { useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import List from './List'
import {
	WEAPON_DAMAGE_MAX,
	WEAPON_CRITICAL_MAX,
	WEAPON_STRENGTH_MAX,
	WEAPON_ATTACK_MAX,
	WEAPON_PENETRATION_MAX,
	SINGLE_COST
} from './constants'

export interface ResultItem {
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

enum SortBy {
	Time,
	ValueDesc,
	ValueAsc,
	MaxDesc,
	CriticalDes
}

/** 最多显示多少结果 */
const SHOW_RESULT_LENGTH = 1000
const INPUT_WIDTH = 130

const { Title } = Typography

const Container = styled.div`
	margin-bottom: 20px;
`

const OverNumTip = styled.span`
	color: #555;
`

const CountRow = styled.div`
	display: grid;
	grid-template-columns: 120px ${INPUT_WIDTH + 20}px auto;
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

const FormItem = styled(Form.Item)`
	margin-bottom: 11px;
`

const SimulateMosaic: React.FC = () => {
	const [count, setCount] = useState(2000)
	const [filter, setFilter] = useState(Filter.ALL)
	const [sortBy, setSortBy] = useState(SortBy.Time)
	// 镶嵌总次数
	const [totalCount, setTotalCount] = useState(0)
	// 镶嵌结果列表
	const [mosaicList, setMosaicList] = useState<ResultItem[]>([])
	const [maxAndCritical, setMaxAndCritical] = useState(240)

	const handleBegin = useCallback(() => {
		const l: ResultItem[] = []
		// 先重置镶嵌总次数
		setTotalCount(0)
		const scrollEle = document.querySelector('.ant-list-items')
		scrollEle?.scrollTo({
			top: 0
		})

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

		switch (filter) {
			case Filter.ALL:
				l = mosaicList
				break
			case Filter.FAILED:
				l = mosaicList.filter(({ isSuccess }) => !isSuccess)
				break
			case Filter.SUCCESS:
				l = mosaicList.filter(({ isSuccess }) => isSuccess)
				break

			default:
				break
		}

		l = l.slice(0, SHOW_RESULT_LENGTH)

		switch (sortBy) {
			case SortBy.Time:
				return l
			case SortBy.ValueDesc:
				return l.sort((a, b) => b.compositeValue - a.compositeValue)
			case SortBy.ValueAsc:
				return l.sort((a, b) => a.compositeValue - b.compositeValue)
			case SortBy.MaxDesc:
				return l.sort((a, b) => b.maxDamage - a.maxDamage)
			case SortBy.CriticalDes:
				return l.sort((a, b) => b.criticalDamage - a.criticalDamage)

			default:
				break
		}
	}, [filter, mosaicList, sortBy])

	const successWeaponNum = useMemo(
		() => mosaicList.filter(({ isSuccess }) => isSuccess).length,
		[mosaicList]
	)

	return (
		<Container>
			<Title level={3}>模拟镶嵌</Title>
			<CountRow>
				<span>模拟总武器数量：</span>
				<InputNumber
					addonAfter='件'
					value={count}
					min={1}
					max={10000}
					onChange={v => setCount(v || 1)}
					style={{ width: INPUT_WIDTH }}
				/>
				<OverNumTip>
					因浏览器性能问题，超过 {SHOW_RESULT_LENGTH} 件武器时不显示全部结果
				</OverNumTip>
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

			<Form>
				<FormItem label='过滤规则'>
					<Radio.Group value={filter} onChange={e => setFilter(e.target.value)}>
						<Radio value={Filter.ALL}>显示全部</Radio>
						<Radio value={Filter.SUCCESS}>仅显示成功结果</Radio>
						<Radio value={Filter.FAILED}>仅显示失败结果</Radio>
					</Radio.Group>
				</FormItem>
				<FormItem label='排序规则'>
					<Radio.Group value={sortBy} onChange={e => setSortBy(e.target.value)}>
						<Radio value={SortBy.Time}>按时间排序</Radio>
						<Radio value={SortBy.ValueDesc}>按综合值从大到小排序</Radio>
						<Radio value={SortBy.ValueAsc}>按综合值从小到大排序</Radio>
						<Radio value={SortBy.MaxDesc}>按大伤从大到小排序</Radio>
						<Radio value={SortBy.CriticalDes}>按爆伤从大到小排序</Radio>
					</Radio.Group>
				</FormItem>
			</Form>

			<List
				totalCount={totalCount}
				successWeaponNum={successWeaponNum}
				filteredList={filteredList}
			/>
		</Container>
	)
}

export default SimulateMosaic
