import { Typography, InputNumber, Form } from 'antd'
import { Rule } from 'antd/lib/form'
import { useState, useMemo, useCallback } from 'react'
import { AlignCenter, FormItem } from '../../styled'
import { WEAPON_CRITICAL_MAX, WEAPON_DAMAGE_MAX } from './constants'
import { ResultItem } from './SimulateMosaic'

const { Title } = Typography

const rules: Rule[] = [{ required: true }]

const CostMathExpect: React.FC = () => {
	const [valueInterval, setValueInterval] = useState(6)
	const [compositeValueLowerLimited, setCompositeValueLowerLimited] =
		useState(260)

	const list = useMemo(() => {
		const total =
			(WEAPON_DAMAGE_MAX + WEAPON_CRITICAL_MAX - compositeValueLowerLimited) /
			valueInterval
		const l = []

		for (let i = 1; i < total; i++) {
			const temp = WEAPON_DAMAGE_MAX + WEAPON_CRITICAL_MAX - i * valueInterval
			l.push(
				temp < compositeValueLowerLimited ? compositeValueLowerLimited : temp
			)
		}

		return l
	}, [compositeValueLowerLimited, valueInterval])

	const handleCalculate = useCallback(() => {
		const l: { compositeValue: number; isSuccess: boolean }[] = []

		for (let i = 0; i < 100000; i++) {
			let isSuccess = false
			const item = {
				maxDamage: 0,
				criticalDamage: 0
			}

			if (Math.random() < 0.45) {
				item.maxDamage = Math.ceil(Math.random() * WEAPON_DAMAGE_MAX)

				// 计算成功后的 大伤 + 爆伤最大值，是否大于期望的综合值
				// 如果小于的话就丢弃
				if (
					item.maxDamage + WEAPON_CRITICAL_MAX >=
					compositeValueLowerLimited
				) {
					if (Math.random() < 0.45) {
						item.criticalDamage = Math.ceil(Math.random() * WEAPON_CRITICAL_MAX)
						isSuccess = true
					}
				}
			}

			const compositeValue = item.criticalDamage + item.maxDamage

			l.push({
				compositeValue,
				isSuccess
			})
		}
	}, [compositeValueLowerLimited])

	return (
		<div>
			<Title level={4}>版本二：</Title>
			<AlignCenter>
				<span>综合值每</span>
				<InputNumber
					value={valueInterval}
					addonAfter='%'
					min={1}
					max={WEAPON_DAMAGE_MAX + WEAPON_CRITICAL_MAX}
					onChange={v => setValueInterval(v || 1)}
					style={{ margin: '0 10px', width: 110 }}
				/>
				<span>设置区间，综合值低于</span>
				<InputNumber
					value={compositeValueLowerLimited}
					addonAfter='%'
					min={2}
					max={WEAPON_DAMAGE_MAX + WEAPON_CRITICAL_MAX - 1}
					onChange={v => setCompositeValueLowerLimited(v || 1)}
					style={{ margin: '0 10px', width: 110 }}
				/>
				<span>丢弃</span>
			</AlignCenter>
			<Form
				onFinish={handleCalculate}
				layout='inline'
				style={{ marginTop: 10 }}
			>
				{list.map(item => (
					<FormItem label={`${item}% ~ ${item + valueInterval}%`} rules={rules}>
						<InputNumber />
					</FormItem>
				))}
			</Form>
		</div>
	)
}

export default CostMathExpect
