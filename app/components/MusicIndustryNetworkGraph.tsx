'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Info, RefreshCw, Clock } from 'lucide-react';

// 定義完整的數據結構，包含節點和連接關係
const graphData = {
  // ... 保持原有的 graphData 內容不變
};

// 定義不同類型節點的圖標和顏色
const getNodeColor = (group) => {
  switch(group) {
    case 'hardware': return '#3498db';
    case 'software': return '#9b59b6';
    case 'data': return '#00bcd4';
    case 'future': return '#4caf50';
    default: return '#95a5a6';
  }
};

// ... 保持其他常量定義不變

const MusicIndustryNetworkGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [filteredData, setFilteredData] = useState(graphData);
  const [filterEra, setFilterEra] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showOnlyKey, setShowOnlyKey] = useState(false);
  const [timeView, setTimeView] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });

  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  // ... 保持視圖控制函數不變

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
  
  // ... 保持佈局計算函數不變

  // 處理節點點擊
  const handleNodeClick = (node) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  };
  
  // 獲取與節點相關的所有連接
  const getRelatedLinks = (nodeId) => {
    return filteredData.links.filter(link => 
      link.source === nodeId || link.target === nodeId
    );
  };
  
  // 獲取與節點相關的所有節點
  const getRelatedNodes = (nodeId) => {
    const relatedNodes = [];
    
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
  
  // ... 保持其他函數不變，但移除未使用的函數

  return (
    // ... 保持原有的 JSX 不變
  );
};

export default MusicIndustryNetworkGraph;