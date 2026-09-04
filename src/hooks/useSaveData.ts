import { useEffect, useState } from 'react'

type Connection = {
  saveData?: boolean
  effectiveType?: string
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

const getConnection = (): Connection | undefined =>
  typeof navigator !== 'undefined'
    ? (navigator as Navigator & { connection?: Connection }).connection
    : undefined

/**
 * True when the visitor is on a metered/slow connection — Data Saver enabled, or
 * an effective 2G/slow-2G link. Used to skip optional multi-megabyte downloads
 * (the 3D avatar) rather than making those users wait for them.
 *
 * The Network Information API is Chromium-only; elsewhere this is simply `false`.
 */
export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    const connection = getConnection()
    if (!connection) return

    const read = () =>
      setSaveData(
        connection.saveData === true ||
          connection.effectiveType === '2g' ||
          connection.effectiveType === 'slow-2g',
      )

    read()
    connection.addEventListener?.('change', read)
    return () => connection.removeEventListener?.('change', read)
  }, [])

  return saveData
}
