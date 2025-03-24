import MusicIndustryNetworkGraph from './src/components/music-industry-network-graph';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-4 md:p-8 bg-[#f9fafb] dark:bg-[#111827]">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          音樂產業網絡可視化
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          這個互動式視覺化展示了音樂產業從硬體時代到資料時代的演變。您可以拖動節點、縮放視圖，並點擊各個元素了解更多信息。
        </p>
      </header>
      
      <div className="flex-grow w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <MusicIndustryNetworkGraph />
      </div>
      
      <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>© 2024 音樂產業網絡研究 | 數據來源：公開行業資料</p>
      </footer>
    </main>
  );
}
