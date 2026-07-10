import Image from 'next/image'
import { EmptyStateProps } from '@/types/EmptyStateProps'

const EmptyState = (props: EmptyStateProps) => {
  const { message, className } = props

  return (
    <div className={`text-center ${className ?? ''}`}>
      <Image
        src="/icon/no-data.png"
        alt="No Data"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <p className="font-medium text-lg">All Clear</p>
      <p className="text-base text-neutral">{message}</p>
    </div>
  )
}

export default EmptyState
