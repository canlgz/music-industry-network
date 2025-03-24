import { Metadata } from 'next';
import MusicIndustryNetworkGraph from './src/components/music-industry-network-graph';

export const metadata: Metadata = {
  title: '音樂產業生態系統：從硬體到軟體再到資料的演變',
  description: '用互動式網絡圖可視化音樂產業從早期硬體到現代數據驅動生態系統的演變',
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold text-center mt-4 mb-2">音樂產業生態系統：從硬體到軟體再到資料的演變</h1>
      
      <div className="flex-1 relative">
        <MusicIndustryNetworkGraph />
      </div>
      
      <footer className="text-center text-gray-500 text-xs py-2">
        © {new Date().getFullYear()} 音樂產業網絡可視化 | 版權所有
      </footer>
    </main>
  );
}
