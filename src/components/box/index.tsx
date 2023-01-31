import { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button, InputNumber, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import testData from './testData'
import { getLSItem } from '../../utils/fn'

interface RecordType {
	name: string
	num: number
	rate: number
	ely: number
	rmb: number
}

const ContentInput = styled(InputNumber<number>)`
	margin-right: 10px;
`

const DataTable = styled(Table<RecordType>)`
	margin-bottom: 33px;
`

const CalculateBtn = styled(Button)`
	margin: 0 6px;
`

const Red = styled.div`
	display: inline-block;
	color: red;
`

const ResultRow = styled.div`
	display: flex;
	align-items: center;
	margin: 15px 0 13px 0;
`

const Flex = styled.div`
	display: flex;
	align-items: center;
`

const Index: React.FC = () => {
	// const [contentNo, setContentNo] = useState<number | null>()
	const [dataSource, setDataSource] = useState(
		getLSItem(testData[0].name, testData)
	)
	const [exchangeRate, setExchangeRate] = useState<number | null>(0.51)
	const [mathExpect, setMathExpect] = useState('0')

	const columns: ColumnsType<RecordType> = [
		{
			title: '道具',
			dataIndex: 'name',
			width: 300,
			key: 'name'
		},
		{
			title: '数量',
			dataIndex: 'num',
			width: 100,
			key: 'num'
		},
		{
			title: '几率/%',
			dataIndex: 'rate',
			width: 100,
			key: 'rate'
		},
		{
			title: 'ely 价格(单价，单位：亿)',
			dataIndex: 'ely',
			key: 'ely',
			width: 240,
			render: (text, row) => (
				<InputNumber
					placeholder='请输入（只能输入数字）'
					style={{ width: 180 }}
					onChange={value => {
						if (!value) {
							return
						}
						setDataSource(pData =>
							pData.map(d => {
								if (d.name === row.name) {
									d.ely = +value
									if (exchangeRate) {
										d.rmb = +(d.ely / exchangeRate).toFixed(3)
									}
								}

								return d
							})
						)
					}}
					min={0}
					value={row.ely}
				/>
			)
		},
		{
			title: 'rmb 价格(单价，单位：元)',
			dataIndex: 'rmb',
			key: 'rmb',
			width: 240,
			render: (text, row) => (
				<InputNumber
					placeholder='请输入（只能输入数字）'
					style={{ width: 180 }}
					onChange={value => {
						if (!value) {
							return
						}
						setDataSource(pData =>
							pData.map(d => {
								if (d.name === row.name) {
									d.rmb = +value
									if (exchangeRate) {
										d.ely = +(d.rmb * exchangeRate).toFixed(3)
									}
								}

								return d
							})
						)
					}}
					min={0}
					value={row.rmb}
				/>
			)
		}
	]

	const getMathExpect = useCallback(() => {
		let worth = 0

		localStorage.setItem(testData[0].name, JSON.stringify(dataSource))
		dataSource.forEach(({ name, num, rmb, rate, ely }) => {
			if (!ely && !rmb) {
				message.error(`请输入 ${name} 的价格`)
				throw new Error()
			}

			const currentWorth = (num * rate * ely) / 100
			worth += currentWorth
		})

		setMathExpect(worth.toFixed(3))
	}, [dataSource])

	const mathExpectRMB = useMemo(() => {
		if (exchangeRate) {
			return (+mathExpect / exchangeRate).toFixed(3)
		}

		return 0
	}, [exchangeRate, mathExpect])

	return (
		<>
			{/* <ContentInput
				addonBefore='contentNo：'
				value={contentNo}
				onChange={v => setContentNo(v)}
			/>
			<Button type='primary' onClick={handleParse}>
				开始解析
			</Button> */}
			<Flex>
				<span>币价：</span>
				<ContentInput
					addonBefore='1 元 rmb ='
					addonAfter='亿 ely'
					min={0.01}
					max={100}
					value={exchangeRate}
					onChange={v => setExchangeRate(v)}
				/>
			</Flex>
			<ResultRow>
				<Red>计算前需输入每件道具的价格</Red>
				<CalculateBtn type='primary' onClick={getMathExpect}>
					计算数学期望
				</CalculateBtn>
				数学期望为：{mathExpect}亿 ely（{mathExpectRMB}元 rmb）
			</ResultRow>
			<div style={{ color: '#333399', fontSize: 24 }}>彩虹島物語精品箱子 V</div>
			<div style={{ color: '#333399' }}>
				販售時間: 2023.01.30 ~ 2023.02.12 23:59
			</div>
			<div style={{ color: '#333399' }}> 販售價格: 10 NTD </div>
			<DataTable
				size='small'
				columns={columns}
				dataSource={dataSource}
				pagination={false}
				rowKey='name'
				sticky
			/>
		</>
	)
}

export default Index
