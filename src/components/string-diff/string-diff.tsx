import React, { FunctionComponent, useEffect, useState } from 'react'

export const StringDiff: FunctionComponent<{
  string: string
  color: string
}> = ({ string, color }) => {
  const [previous, setPrevious] = useState(string)
  const [current, setCurrent] = useState(string)

  useEffect(() => {
    setCurrent((prev) => {
      setPrevious(prev)
      return string
    })
  }, [string])

  if (!current) return null

  const indexOfFirstDifferentCharacter = ((): number => {
    if (current === previous) return Infinity

    for (let i = 0; i < current.length; i++) {
      if (current[i] !== previous[i]) return i
    }

    return -Infinity
  })()

  const equalPart = current.slice(0, indexOfFirstDifferentCharacter)
  const diffPart = current.slice(indexOfFirstDifferentCharacter)

  return (
    <span>
      <span>{equalPart}</span>
      <span style={{ color, transition: 'color linear .5s' }}>{diffPart}</span>
    </span>
  )
}
