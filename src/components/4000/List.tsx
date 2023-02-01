import styled from 'styled-components'
import { List as AList } from 'antd'
import { SINGLE_COST } from './constants'
import { ResultItem } from './SimulateMosaic'
import { memo } from 'react'

const ML = 10

interface Props {
	totalCount: number
	successWeaponNum: number
	filteredList?: ResultItem[]
}

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

const ScrollList = styled(AList<ResultItem>)`
	max-width: 850px;

	.ant-list-items {
		max-height: 600px;
		overflow-y: scroll;
	}
`

const List: React.FC<Props> = ({
	totalCount,
	successWeaponNum,
	filteredList
}) => {
	return (
		<ScrollList
			size='small'
			header={<span>镶嵌结果</span>}
			footer={
				<span>
					一共镶嵌了：{totalCount} 次，成本约为：
					{(totalCount * SINGLE_COST).toFixed(2)} 亿，成功了 {successWeaponNum}{' '}
					件
				</span>
			}
			bordered
			dataSource={filteredList}
			renderItem={({
				maxDamage,
				criticalDamage,
				isSuccess,
				compositeValue,
				order,
				successCount
			}) => (
				<AList.Item>
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
										<SuccessTip>镶嵌成功，综合值为{compositeValue}%</SuccessTip>
									)}
								</span>
							) : successCount === 1 ? (
								<MLSpan>大伤过低，丢弃</MLSpan>
							) : (
								<MLSpan>第二次镶嵌失败</MLSpan>
							)}
						</span>
					) : (
						<span>第一次镶嵌失败</span>
					)}
				</AList.Item>
			)}
		/>
	)
}

export default memo(List)
