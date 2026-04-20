type Props = {
  title: string
  value: string
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}