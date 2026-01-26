export const Slogan = () => {
  return (
    <>
      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-sm font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">WoQu 文档</h1>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">愉悦工作 尽在我去</p>
      </div>
    </>
  )
}
