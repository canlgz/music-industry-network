'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Info, RefreshCw, Clock } from 'lucide-react';

// 定義完整的數據結構，包含節點和連接關係
const graphData = {
  nodes: [
    // 硬體時代節點
    { id: "vinyl", name: "黑膠唱片", group: "hardware", type: "medium", year: "1948", era: "hardware", size: 20, key: true,
      description: "12吋33⅓轉 LP專輯格式成為標準，為專輯藝術提供載體", 
      stats: "在1970年代銷量達到頂峰，全球每年超過5億張" },
    // ... 其他節點
  ],
  links: [
    // ... 連接
  ]
};

// 定義不同類型節點的圖標和顏色
const getNodeColor = (group: string) => {
  switch(group) {
    case 'hardware': return '#3498db';
    case 'software': return '#9b59b6';
    case 'data': return '#00bcd4';
    case 'future': return '#4caf50';
    default: return '#95a5a6';
  }
};

const MusicIndustryNetworkGraph = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<any>(null);
  const [filteredData, setFilteredData] = useState(graphData);
  const [filterEra, setFilterEra] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showOnlyKey, setShowOnlyKey] = useState(false);
  const [timeView, setTimeView] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
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

  // 過濾數據
  useEffect(() => {
    let nodes = graphData.nodes;
    
    if (filterEra !== "all") {
      nodes = nodes.filter(node => node.era === filterEra);
    }
    
    if (filterType !== "all") {
      nodes = nodes.filter(node => node.type === filterType);
    }
    
    if (showOnlyKey) {
      nodes = nodes.filter(node => node.key);
    }
    
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = graphData.links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );
    
    setFilteredData({ nodes, links });
  }, [filterEra, filterType, showOnlyKey]);

  // 處理節點點擊
  const handleNodeClick = (node: any) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  };

  // 獲取與節點相關的所有連接
  const getRelatedLinks = (nodeId: string) => {
    return filteredData.links.filter(link => 
      link.source === nodeId || link.target === nodeId
    );
  };

  // 獲取與節點相關的所有節點
  const getRelatedNodes = (nodeId: string) => {
    const relatedNodes: string[] = [];
    
    filteredData.links.forEach(link => {
      if (link.source === nodeId && !relatedNodes.includes(link.target)) {
        relatedNodes.push(link.target);
      }
      if (link.target === nodeId && !relatedNodes.includes(link.source)) {
        relatedNodes.push(link.source);
      }
    });
    
    return relatedNodes;
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
          {/* 這裡添加你的 SVG 元素 */}
        </svg>
      </div>
    </div>
  );
};

export default MusicIndustryNetworkGraph;