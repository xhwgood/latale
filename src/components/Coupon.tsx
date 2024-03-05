import { Table } from 'antd'
import { memo } from 'react'
import data from './data.json'

const Coupon = () => {
	return (
		<Table
			dataSource={data}
			style={{ width: 1100 }}
			columns={[
				{
					title: '序号',
					render: (_, __, i) => i + 1
				},
				{
					title: '活动名称',
					dataIndex: 'name'
				},
				{
					title: '使用日期',
					dataIndex: 'usedTime'
				},
				{
					title: '序号',
					dataIndex: 'id'
				},
				{
					title: '状态',
					dataIndex: 'status'
				}
			]}
			pagination={false}
		/>
	)
}

export default memo(Coupon)
