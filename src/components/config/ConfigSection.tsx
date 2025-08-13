interface ConfigSectionProps {
  title: string
  children: React.ReactNode
}

export default function ConfigSection({ title, children }: ConfigSectionProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}