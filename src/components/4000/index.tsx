import { useState, useMemo } from 'react'
import { Card, InputNumber } from 'antd'
import styled from 'styled-components'

type NumberNull = number | null

/** 大伤最大值 */
const WEAPON_DAMAGE_MAX = 220
/** 爆伤最大值 */
const WEAPON_CRITICAL_MAX = 130
/** 力量/魔力最大值 */
const WEAPON_STRENGTH_MAX = 13
/** 攻击力/属性力最大值 */
const WEAPON_ATTACK_MAX = 13
/** 贯穿力最大值 */
const WEAPON_PENETRATION_MAX = 35

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
		console.log({ count, tempRate })

		cost = (3 * count) / Math.pow(0.45, count) / tempRate

		return cost
	}, [
		weaponMax,
		weaponCritical,
		weaponStrength,
		weaponAttack,
		weaponPenetration
	])

	return (
		<div>
			<div>基础成功率 45%，一次成本 3亿 ely</div>
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
				最终成本：{weaponCost} 亿
			</Classification>
		</div>
	)
}

export default Index
