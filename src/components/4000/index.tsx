import { useState, useMemo } from 'react'
import { Card, Collapse, Divider, InputNumber, Typography } from 'antd'
import styled from 'styled-components'
import {
	WEAPON_DAMAGE_MAX,
	WEAPON_CRITICAL_MAX,
	WEAPON_STRENGTH_MAX,
	WEAPON_ATTACK_MAX,
	WEAPON_PENETRATION_MAX,
	SINGLE_COST
} from './constants'
import SimulateMosaic from './SimulateMosaic'

type NumberNull = number | null

const { Panel } = Collapse
const { Title } = Typography

const Classification = styled(Card)`
	width: 300px;
	margin-top: 8px;

	.ant-card-head {
		padding: 0 12px;
	}

	.ant-card-head-title {
		padding: 12px 0;
	}

	.ant-card-body {
		display: grid;
		gap: 9px;
	}

	.ant-card-body {
		padding: 12px;
	}
`

const Index: React.FC = () => {
	const [weaponMax, setWeaponMax] = useState<NumberNull>()
	const [weaponCritical, setWeaponCritical] = useState<NumberNull>()
	const [weaponStrength, setWeaponStrength] = useState<NumberNull>()
	const [weaponAttack, setWeaponAttack] = useState<NumberNull>()
	const [weaponPenetration, setWeaponPenetration] = useState<NumberNull>()

	const weaponCost = useMemo(() => {
		/** 镶嵌次数 */
		let count = 0
		let cost = 0
		let tempRate = 1

		if (weaponMax) {
			count += 1
			if (weaponMax > WEAPON_DAMAGE_MAX / 2) {
				tempRate = ((WEAPON_DAMAGE_MAX - weaponMax) * 2 + 1) / WEAPON_DAMAGE_MAX
			}
		}

		if (weaponCritical) {
			count += 1
			if (weaponCritical > WEAPON_CRITICAL_MAX / 2) {
				const rate =
					((WEAPON_CRITICAL_MAX - weaponCritical) * 2 + 1) / WEAPON_CRITICAL_MAX

				tempRate = tempRate * rate
			}
		}

		if (weaponStrength) {
			count += 1
			if (weaponStrength > WEAPON_STRENGTH_MAX / 2) {
				const rate =
					((WEAPON_STRENGTH_MAX - weaponStrength) * 2 + 1) / WEAPON_STRENGTH_MAX

				tempRate = tempRate * rate
			}
		}

		if (weaponAttack) {
			count += 1
			if (weaponAttack > WEAPON_ATTACK_MAX / 2) {
				const rate =
					((WEAPON_ATTACK_MAX - weaponAttack) * 2 + 1) / WEAPON_ATTACK_MAX

				tempRate = tempRate * rate
			}
		}

		if (weaponPenetration) {
			count += 1
			if (weaponPenetration > WEAPON_PENETRATION_MAX / 2) {
				const rate =
					((WEAPON_PENETRATION_MAX - weaponPenetration) * 2 + 1) /
					WEAPON_PENETRATION_MAX

				tempRate = tempRate * rate
			}
		}
		// console.log({ count, tempRate })

		cost = (SINGLE_COST * count) / Math.pow(0.45, count) / tempRate

		return cost.toFixed(2)
	}, [
		weaponMax,
		weaponCritical,
		weaponStrength,
		weaponAttack,
		weaponPenetration
	])

	return (
		<div>
			<Collapse ghost>
				<Panel header='查看镶嵌数值' key='1'>
					<p>大伤最大值为：{WEAPON_DAMAGE_MAX}%</p>
					<p>爆伤最大值为：{WEAPON_CRITICAL_MAX}%</p>
					<p>力量/魔力最大值为：{WEAPON_STRENGTH_MAX}%</p>
					<p>攻击力/属性力最大值为：{WEAPON_ATTACK_MAX}%</p>
					<p>贯穿力最大值为：{WEAPON_PENETRATION_MAX}%</p>
				</Panel>
			</Collapse>
			<Title level={3}>成本计算器(未完善，计算结果比实际偏高)</Title>
			<div>基础成功率 45%，一次成本 3亿 ely + 2 黄金锤（300万 ely）</div>
			<Classification title='武器（默认成本为 0）'>
				<InputNumber
					addonBefore='大伤：'
					addonAfter='%'
					value={weaponMax}
					onChange={v => setWeaponMax(v)}
					min={1}
					max={WEAPON_DAMAGE_MAX}
				/>
				<InputNumber
					addonBefore='爆伤：'
					addonAfter='%'
					value={weaponCritical}
					onChange={v => setWeaponCritical(v)}
					min={1}
					max={WEAPON_CRITICAL_MAX}
				/>
				<InputNumber
					addonBefore='力量/魔力：'
					addonAfter='%'
					value={weaponStrength}
					onChange={v => setWeaponStrength(v)}
					min={1}
					max={WEAPON_STRENGTH_MAX}
				/>
				<InputNumber
					addonBefore='攻击力/属性力：'
					addonAfter='%'
					value={weaponAttack}
					onChange={v => setWeaponAttack(v)}
					min={1}
					max={WEAPON_ATTACK_MAX}
				/>
				<InputNumber
					addonBefore='贯穿力：'
					addonAfter='%'
					value={weaponPenetration}
					onChange={v => setWeaponPenetration(v)}
					min={1}
					max={WEAPON_PENETRATION_MAX}
				/>
				最终成本约为：{weaponCost} 亿
			</Classification>
			<Divider />
			<SimulateMosaic />
		</div>
	)
}

export default Index
