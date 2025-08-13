export default function LogoIcon() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative">
        <div className="w-5 h-5 bg-white transform rotate-45 rounded-sm relative">
          <div className="absolute w-1.5 h-1.5 bg-bet-red-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-sm"></div>
        </div>
      </div>
      <div className="relative w-5 h-5 bg-white rounded-sm">
        <div className="absolute w-0.5 h-0.5 bg-bet-red-500 rounded-full top-1 left-1"></div>
        <div className="absolute w-0.5 h-0.5 bg-bet-red-500 rounded-full bottom-1 right-1"></div>
        <div className="absolute w-0.5 h-0.5 bg-bet-red-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  )
}