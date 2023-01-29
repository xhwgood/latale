import { useCallback, useState } from 'react'
import { InputNumber, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { LXXIII } from './testData'

const Index: React.FC = () => {
	const [dataSource, setDataSource] = useState(
		LXXIII.map(p => ({ ...p, ely: 0, rmb: 0 }))
	)
	const columns: ColumnsType<{
		name: string
		num: number
		rate: number
		ely: number
		rmb: number
	}> = [
		{
			title: '道具',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: '数量',
			dataIndex: 'num',
			key: 'num'
		},
		{
			title: '几率/%',
			dataIndex: 'rate',
			key: 'rate'
		},
		{
			title: 'ELY价格',
			dataIndex: 'ely',
			key: 'ely',
			render: (text, row) => (
				<InputNumber
					placeholder='请输入（只能输入数字）'
					onChange={value => {
						if (!value) {
							return
						}
						setDataSource([
							...dataSource.map(d => {
								if (d.name === row.name) {
									d.ely = +value
								}
								return d
							})
						])
					}}
				/>
			)
		},
		{
			title: 'RMB价格',
			dataIndex: 'rmb',
			key: 'rmb',
			render: (text, row) => (
				<InputNumber
					placeholder='请输入（只能输入数字）'
					onChange={value => {
						if (!value) {
							return
						}
						setDataSource([
							...dataSource.map(d => {
								if (d.name === row.name) {
									d.rmb = +value
								}
								return d
							})
						])
					}}
				/>
			)
		}
	]

	const getMathExpect = useCallback(() => {
		let worth = 0

		dataSource.forEach(({ num, rate, ely }) => {
			const currentWorth = num * rate * ely
			worth += currentWorth
		})

    return worth
	}, [dataSource])

	return (
		<>
			<Table columns={columns} dataSource={dataSource} />
		</>
	)
}

export default Index
