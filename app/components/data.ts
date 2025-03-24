import { GraphData } from './types';

export const graphData: GraphData = {
  nodes: [
    {
      id: "vinyl",
      name: "黑膠唱片",
      group: "hardware",
      era: "hardware",
      type: "medium",
      year: "1950",
      description: "最早的主流音樂載體之一，提供高品質類比音訊",
      stats: "2020年全球銷量超過2700萬張",
      key: true
    },
    {
      id: "cd",
      name: "CD",
      group: "hardware",
      era: "hardware",
      type: "medium",
      year: "1982",
      description: "首個數位音訊載體，徹底改變音樂產業",
      stats: "1999年全球銷量達到峰值，超過25億張",
      key: true
    },
    {
      id: "streaming",
      name: "串流服務",
      group: "data",
      era: "data",
      type: "platform",
      year: "2008",
      description: "基於訂閱的音樂串流服務，改變音樂消費模式",
      stats: "2023年全球訂閱用戶超過6億",
      key: true
    }
  ],
  links: [
    {
      source: "vinyl",
      target: "cd",
      description: "數位化轉型：從類比到數位音訊的革命性轉變"
    },
    {
      source: "cd",
      target: "streaming",
      description: "從擁有到訪問：音樂消費模式的根本轉變"
    }
  ]
};