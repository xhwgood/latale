import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { LS_KZN_TIMES, LS_MY_SKILLS, NORMAL_SKILLS, SPEED } from '../../constants'

const Container = styled.div`
  width: 182px;
  font-size: 12px;
  color: #ffc4a6;
  cursor: default;
`

const Wrapper = styled.div`
  box-sizing: border-box;
  background: linear-gradient(to right, rgb(47, 20, 21) 5%, rgb(61, 37, 30) 95%, rgb(47, 20, 21));
  display: flex;
  flex-direction: column;
  border-radius: 6px 6px 0 0;
  padding: 6px 4px 0 0;
`

const Item = styled.div`
  height: 18px;
  padding-left: 4px;

  &:hover {
    background: linear-gradient(to right, #ffeaa656 50%, transparent 96%);
  }
`

const Label = styled.span`
  display: inline-block;
  margin-right: 6px;
`

const Bottom = styled.div`
  position: relative;
  background: rgb(28, 17, 14);
  padding-left: 35px;
  height: 22px;
  line-height: 22px;
  border-radius: 0 0 6px 6px;
  text-shadow: 0 0 4px #ffc4a6;
`

const Triangle = styled.div`
  position: absolute;
  right: 14px;
  top: 8px;
  transform: rotate(-45deg);
  background: linear-gradient(45deg, transparent 50%, rgb(253, 231, 128) 0%);
  background-size: 11px 11px;
  width: 11px;
  height: 11px;
  border-radius: 4px 0;
`

type MySkills = {
  skillName: string
  skillGrade: number
}[]

const Index = () => {
  const [mySkills, setMySkills] = useState<MySkills>()

  const generateRandomSkill = useCallback(
    (currentSkills?: MySkills) => {
      /** 洗出来的技能不会重复，需要将已有的技能进行过滤（但速度可以重复） */
      const filterSkills = NORMAL_SKILLS.filter(skill => {
        return !currentSkills?.some(item => item.skillName !== SPEED && item.skillName === skill)
      })

      /** 从数组中随机获取索引 */
      const idx = Math.floor(Math.random() * filterSkills.length)
      const skillName = filterSkills[idx]
      const skillGrade = Math.ceil(Math.random() * 5)

      return {
        skillGrade,
        skillName
      }
    },
    []
  )

  useEffect(() => {
    const lsSkills = localStorage.getItem(LS_MY_SKILLS)
    if (lsSkills) {
      setMySkills(JSON.parse(lsSkills))
    } else {
      const currentSkills: MySkills = []
      const newSkills = Array(9).fill(0).map(_ => {
        const skill = generateRandomSkill(currentSkills)
        currentSkills.push(skill)

        return skill
      })

      localStorage.setItem(LS_KZN_TIMES, '9')
      setMySkills(newSkills)
    }
  }, [generateRandomSkill])

  useEffect(() => {
    localStorage.setItem(LS_MY_SKILLS, JSON.stringify(mySkills))
  }, [mySkills])

  const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    ({ currentTarget: { dataset: { i } } }) => {
      if (!i) {
        return
      }
      const newSkill = generateRandomSkill(mySkills)
      const dataI = Number(i)
      const mySkillsCopy = JSON.parse(JSON.stringify(mySkills))
      mySkillsCopy[dataI] = newSkill
      setMySkills(mySkillsCopy)

      const lsTimes = localStorage.getItem(LS_KZN_TIMES)
      const current = Number(lsTimes) + 1
      localStorage.setItem(LS_KZN_TIMES, String(current))
    },
    [mySkills, generateRandomSkill]
  )

  return (
    <Container>
      <Wrapper>
        {mySkills?.map(({ skillGrade, skillName }, i) => (
          <Item onClick={handleClick} data-i={i} key={skillName + i}>
            <Label>[{skillName === SPEED ? '1' : 'S'}]</Label>{skillName + ' +' + skillGrade}{skillName === SPEED ? '%' : 'Lv'}
          </Item>
        ))}
      </Wrapper>
      <Bottom>卡兹诺的记忆效果<Triangle /></Bottom>
    </Container>
  )
}

export default Index
