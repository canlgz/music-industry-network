'use client';

import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  group: string;
  type: string;
  year: string;
  era: string;
  size: number;
  key: boolean;
  description: string;
  stats: string;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// 定義完整的數據結構，包含節點和連接關係
const graphData: GraphData = {
  nodes: [
    // 硬體時代節點
    {
      id: "vinyl",
      name: "黑膠唱片",
      group: "hardware",
      type: "medium",
      year: "1948",
      era: "hardware",
      size: 20,
      key: true,
      description: "12吋33⅓轉 LP專輯格式成為標準，為專輯藝術提供載體",
      stats: "在1970年代銷量達到頂峰，全球每年超過5億張"
    }
    // ... 其他節點
  ],
  links: []
};

const MusicIndustryNetworkGraph: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 視圖控制
  const increaseZoom = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const decreaseZoom = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetView = () => {
    setZoomLevel(1);
    setViewPosition({ x: 0, y: 0 });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">音樂產業生態系統演變</h1>
        <div className="flex space-x-4">
          <button onClick={increaseZoom}>
            <ZoomIn className="w-6 h-6" />
          </button>
          <button onClick={decreaseZoom}>
            <ZoomOut className="w-6 h-6" />
          </button>
          <button onClick={resetView}>
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 relative" ref={containerRef}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{
            transform: `scale(${zoomLevel}) translate(${viewPosition.x}px, ${viewPosition.y}px)`,
          }}
        >
          {/* 渲染節點 */}
          {graphData.nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.size * 2}, ${node.size * 2})`}>
              <circle
                r={node.size}
                fill={node.group === 'hardware' ? '#3498db' : '#9b59b6'}
              />
              <text
                dy=".35em"
                textAnchor="middle"
                className="text-sm fill-current"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default MusicIndustryNetworkGraph;