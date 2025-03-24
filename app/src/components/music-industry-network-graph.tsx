"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Info, Filter, Disc, Speaker, Smartphone, FileText, Database, Share2, PieChart, DollarSign, RefreshCw, Clock } from 'lucide-react';
import _ from 'lodash';

// 定義節點和鏈接的類型
type NodeType = {
  id: string;
  name: string;
  group: string;
  year?: number | string;
  type?: string;
  icon?: string;
  description?: string;
  revenue?: number;
  impact?: number;
  // 添加其他可能的屬性
  era?: string;
  size?: number;
  key?: boolean;
  stats?: string;
};

type LinkType = {
  source: string;
  target: string;
  type?: string;
  strength?: number;
};

// 定義完整的數據結構，包含節點和連接關係
const graphData = {
  nodes: [
    // 硬體時代節點
    { id: "vinyl", name: "黑膠唱片", group: "hardware", type: "medium", year: "1948", era: "hardware", size: 20, key: true,
      description: "12吋33⅓轉 LP專輯格式成為標準，為專輯藝術提供載體", 
      stats: "在1970年代銷量達到頂峰，全球每年超過5億張" },
    { id: "cassette", name: "盒式錄音帶", group: "hardware", type: "medium", year: "1963", era: "hardware", size: 18, key: true,
      description: "飛利浦設計的Compact Cassette成為全球標準，首次實現家用錄音", 
      stats: "1980年代達到頂峰，美國銷量超過黑膠" },
    { id: "cd", name: "光碟 CD", group: "hardware", type: "medium", year: "1982", era: "hardware", size: 22, key: true,
      description: "索尼與飛利浦合作開發，74分鐘數位音質，替代類比媒介", 
      stats: "1999年達到頂峰，全球銷量26億張" },
    { id: "walkman", name: "索尼隨身聽", group: "hardware", type: "device", year: "1979", era: "hardware", size: 20, key: true,
      description: "首次實現音樂隨身攜帶，徹底改變音樂消費場景與習慣", 
      stats: "累計銷量超過4億台" },
    { id: "cdplayer", name: "CD播放機", group: "hardware", type: "device", year: "1982", era: "hardware", size: 16, key: false,
      description: "開啟數位音樂時代，索尼CDP-101為首款商用CD播放機", 
      stats: "索尼Discman在1990年代銷量超過1000萬台" },
    { id: "bigfive", name: "五大唱片公司", group: "hardware", type: "business", year: "1980", era: "hardware", size: 25, key: true,
      description: "環球、索尼、百代、華納、寶麗金共同控制全球80%以上音樂市場", 
      stats: "1999年全球音樂市場規模286億美元" },
    { id: "physicalretail", name: "實體零售網絡", group: "hardware", type: "business", year: "1950", era: "hardware", size: 15, key: false,
      description: "唱片行、連鎖店和大賣場構成全球分銷網絡", 
      stats: "1990年代，美國擁有超過12,000家唱片店" },
    { id: "albumformat", name: "專輯銷售模式", group: "hardware", type: "business", year: "1950", era: "hardware", size: 18, key: true,
      description: "強制消費者購買整張專輯，無法選購單曲的商業模式", 
      stats: "CD平均零售價16-18美元，成本僅約1美元" },
    { id: "radio", name: "廣播電台", group: "hardware", type: "channel", year: "1920", era: "hardware", size: 16, key: false,
      description: "主要音樂推廣渠道，影響排行榜和唱片銷量", 
      stats: "1980年代，美國94%的人每週收聽廣播" },
    { id: "mtv", name: "音樂電視MTV", group: "hardware", type: "channel", year: "1981", era: "hardware", size: 18, key: false,
      description: "首個24小時音樂視頻頻道，徹底改變音樂營銷", 
      stats: "1991年覆蓋超過2.5億家庭" },
    
    // 軟體時代節點
    { id: "mp3", name: "MP3格式", group: "software", type: "technology", year: "1993", era: "software", size: 25, key: true,
      description: "壓縮比10:1，由德國弗勞恩霍夫研究所開發，數位音樂革命的關鍵", 
      stats: "將音樂檔案從50MB壓縮至3-5MB" },
    { id: "napster", name: "Napster", group: "software", type: "platform", year: "1999", era: "software", size: 22, key: true,
      description: "首個大型P2P音樂分享網絡，徹底顛覆傳統音樂產業鏈", 
      stats: "高峰期擁有8000萬註冊用戶" },
    { id: "itunes", name: "iTunes Store", group: "software", type: "platform", year: "2003", era: "software", size: 24, key: true,
      description: "蘋果推出的數位音樂商店，以99美分單曲銷售模式顛覆產業", 
      stats: "2010年達到70%市場份額，累計售出160億首歌曲" },
    { id: "ipod", name: "Apple iPod", group: "software", type: "device", year: "2001", era: "software", size: 22, key: true,
      description: "革命性數位音樂播放器，與iTunes形成生態閉環", 
      stats: "累計銷量超過4億台" },
    { id: "winamp", name: "Winamp", group: "software", type: "software", year: "1997", era: "software", size: 16, key: false,
      description: "首個流行的MP3播放器應用，「它真的能鞭打駱駝的屁股」", 
      stats: "鼎盛時期有超過6000萬月活用戶" },
    { id: "drm", name: "數位版權管理", group: "software", type: "technology", year: "2003", era: "software", size: 16, key: false,
      description: "Apple FairPlay等DRM技術限制音樂使用權，最終在消費者抵抗下退場", 
      stats: "2009年，iTunes所有音樂移除DRM限制" },
    { id: "singlemodel", name: "單曲銷售模式", group: "software", type: "business", year: "2003", era: "software", size: 18, key: true,
      description: "顛覆專輯捆綁銷售，按歌曲定價的革命性商業模式", 
      stats: "蘋果從每首99美分收取30%佣金" },
    { id: "indielabels", name: "獨立發行崛起", group: "software", type: "business", year: "2000", era: "software", size: 16, key: false,
      description: "數位平台降低發行門檻，獨立藝人和廠牌崛起", 
      stats: "獨立音樂市場份額從5%增長至30%以上" },
    { id: "bittorrent", name: "BitTorrent", group: "software", type: "technology", year: "2001", era: "software", size: 16, key: false,
      description: "分散式檔案分享協議，難以監控和打擊", 
      stats: "高峰期佔據全球網路流量的20%" },
    { id: "digitaldownload", name: "數位下載市場", group: "software", type: "business", year: "2005", era: "software", size: 18, key: false,
      description: "iTunes、Amazon MP3等平台組成的合法數位下載生態", 
      stats: "2012年佔全球音樂收入的40%" },
    
    // 資料時代節點
    { id: "spotify", name: "Spotify", group: "data", type: "platform", year: "2008", era: "data", size: 28, key: true,
      description: "全球最大串流音樂平台，訂閱+廣告雙重商業模式", 
      stats: "5.74億活躍用戶，31%市佔率" },
    { id: "applemusic", name: "Apple Music", group: "data", type: "platform", year: "2015", era: "data", size: 22, key: true,
      description: "蘋果推出的純訂閱串流音樂服務", 
      stats: "1億+付費用戶" },
    { id: "userdata", name: "使用者行為資料", group: "data", type: "asset", year: "2010", era: "data", size: 24, key: true,
      description: "聆聽歷史、播放習慣、跳過行為等用戶互動數據", 
      stats: "Spotify每日收集超過1.5億次用戶互動資料" },
    { id: "algorithms", name: "推薦演算法", group: "data", type: "technology", year: "2015", era: "data", size: 24, key: true,
      description: "Discover Weekly、Release Radar等個人化推薦功能", 
      stats: "演算法決定31%以上的串流量" },
    { id: "contentanalysis", name: "音樂內容分析", group: "data", type: "technology", year: "2010", era: "data", size: 18, key: false,
      description: "AI自動分析音樂節奏、情緒、風格特徵", 
      stats: "Spotify分析的音樂特徵超過400種" },
    { id: "subscription", name: "訂閱模式", group: "data", type: "business", year: "2010", era: "data", size: 22, key: true,
      description: "從音樂擁有轉向訪問權訂閱的商業模式", 
      stats: "串流音樂在2023年佔全球音樂收入的84.1%" },
    { id: "micropayments", name: "微支付分潤", group: "data", type: "business", year: "2010", era: "data", size: 16, key: false,
      description: "按播放次數分配版稅的Pro-rata模式", 
      stats: "藝人每次播放收益僅約0.003-0.005美元" },
    { id: "platformintegration", name: "平台整合", group: "data", type: "business", year: "2015", era: "data", size: 18, key: false,
      description: "串流平台擴展到播客、有聲書、社交功能", 
      stats: "Spotify在2019-2023年間投資超過10億美元於播客" },
    { id: "cloudinfra", name: "雲端基礎設施", group: "data", type: "technology", year: "2010", era: "data", size: 16, key: false,
      description: "大規模分散式系統支持億級用戶串流", 
      stats: "Spotify每日服務超過100PB的資料傳輸" },
    { id: "mobileapp", name: "行動應用生態", group: "data", type: "platform", year: "2010", era: "data", size: 18, key: false,
      description: "智慧型手機成為主要音樂消費平台", 
      stats: "87%的串流音樂通過行動裝置收聽" },
    
    // 未來趨勢節點
    { id: "nftmusic", name: "NFT音樂", group: "future", type: "technology", year: "2021", era: "future", size: 20, key: true,
      description: "區塊鏈上的音樂所有權證明，繞過傳統分發模式", 
      stats: "Kings of Leon通過NFT銷售獲得200萬美元收入" },
    { id: "aimusic", name: "AI生成音樂", group: "future", type: "technology", year: "2023", era: "future", size: 20, key: true,
      description: "Google的MusicLM、OpenAI的Jukebox等AI音樂生成工具", 
      stats: "AI音樂市場預計2030年達到100億美元" },
    { id: "superapps", name: "超級應用整合", group: "future", type: "platform", year: "2020", era: "future", size: 16, key: false,
      description: "騰訊音樂等平台整合社交、遊戲、直播功能", 
      stats: "中國數位音樂用戶超過7億人" },
    { id: "regulation", name: "平台監管", group: "future", type: "policy", year: "2022", era: "future", size: 16, key: false,
      description: "歐盟「數位市場法案」等監管平台壟斷的法規", 
      stats: "違反規定可罰款全球營收的10%" },
    { id: "metaverse", name: "元宇宙音樂", group: "future", type: "platform", year: "2021", era: "future", size: 16, key: false,
      description: "虛擬演唱會和沉浸式音樂體驗", 
      stats: "Travis Scott在Fortnite的虛擬演唱會吸引超過1200萬觀眾" },
    { id: "decentralized", name: "去中心化平台", group: "future", type: "platform", year: "2022", era: "future", size: 18, key: false,
      description: "基於區塊鏈的去中心化音樂發行與交易平台", 
      stats: "Audius平台擁有超過700萬月活用戶" },
  ],
  
  links: [
    // 硬體時代內部連接
    { source: "vinyl", target: "albumformat", value: 10, description: "黑膠唱片確立了專輯為主要銷售單位的模式" },
    { source: "vinyl", target: "bigfive", value: 8, description: "唱片公司控制唱片製造與發行" },
    { source: "cassette", target: "walkman", value: 10, description: "錄音帶與隨身聽的完美結合" },
    { source: "cd", target: "cdplayer", value: 10, description: "數位媒介與播放設備的配套發展" },
    { source: "cd", target: "bigfive", value: 12, description: "CD時代五大唱片公司達到控制頂峰" },
    { source: "bigfive", target: "physicalretail", value: 10, description: "唱片公司控制實體零售通路" },
    { source: "bigfive", target: "albumformat", value: 12, description: "唱片公司推動專輯銷售模式最大化利潤" },
    { source: "radio", target: "bigfive", value: 8, description: "電台與唱片公司合作控制音樂推廣" },
    { source: "mtv", target: "bigfive", value: 8, description: "MTV成為唱片公司新的行銷管道" },
    
    // 軟體時代內部連接
    { source: "mp3", target: "napster", value: 12, description: "MP3格式促成Napster等P2P網絡興起" },
    { source: "mp3", target: "winamp", value: 8, description: "首批MP3播放軟體" },
    { source: "ipod", target: "itunes", value: 15, description: "硬體與軟體結合的生態系統" },
    { source: "itunes", target: "singlemodel", value: 12, description: "iTunes建立單曲銷售模式" },
    { source: "itunes", target: "drm", value: 8, description: "數位版權管理限制音樂使用" },
    { source: "napster", target: "bigfive", value: 10, description: "顛覆傳統音樂發行模式" },
    { source: "bittorrent", target: "digitaldownload", value: 8, description: "盜版促使合法數位下載發展" },
    { source: "mp3", target: "indielabels", value: 8, description: "數位格式降低製作與發行門檻" },
    
    // 資料時代內部連接
    { source: "spotify", target: "subscription", value: 15, description: "建立訂閱式串流模式" },
    { source: "spotify", target: "userdata", value: 12, description: "收集海量用戶行為數據" },
    { source: "userdata", target: "algorithms", value: 15, description: "用戶數據訓練推薦算法" },
    { source: "algorithms", target: "contentanalysis", value: 10, description: "結合內容分析優化推薦" },
    { source: "spotify", target: "micropayments", value: 8, description: "按播放次數分配版稅" },
    { source: "spotify", target: "platformintegration", value: 10, description: "擴展到多元內容形式" },
    { source: "applemusic", target: "subscription", value: 10, description: "採用純訂閱模式" },
    { source: "mobileapp", target: "spotify", value: 12, description: "行動裝置成為主要收聽平台" },
    { source: "cloudinfra", target: "spotify", value: 8, description: "雲基礎設施支持串流服務" },
    
    // 未來趨勢內部連接
    { source: "nftmusic", target: "decentralized", value: 10, description: "NFT促進去中心化平台發展" },
    { source: "aimusic", target: "contentanalysis", value: 8, description: "AI內容分析發展到生成創作" },
    { source: "regulation", target: "spotify", value: 8, description: "反壟斷監管針對主導平台" },
    { source: "metaverse", target: "superapps", value: 6, description: "虛擬體驗與超級應用融合" },
    
    // 跨時代連接 - 硬體到軟體
    { source: "cd", target: "mp3", value: 12, description: "CD為MP3提供數位原始素材" },
    { source: "albumformat", target: "singlemodel", value: 10, description: "專輯模式被單曲模式顛覆" },
    { source: "bigfive", target: "itunes", value: 15, description: "唱片公司被迫與數位平台合作" },
    { source: "walkman", target: "ipod", value: 12, description: "便攜音樂播放概念傳承" },
    { source: "physicalretail", target: "digitaldownload", value: 12, description: "實體零售被數位下載替代" },
    
    // 跨時代連接 - 軟體到資料
    { source: "itunes", target: "spotify", value: 15, description: "從購買模式到訂閱模式" },
    { source: "itunes", target: "applemusic", value: 12, description: "蘋果自身從下載轉向串流" },
    { source: "singlemodel", target: "subscription", value: 10, description: "單曲購買轉向按月訂閱" },
    { source: "ipod", target: "mobileapp", value: 10, description: "專用硬體到手機應用的轉變" },
    { source: "drm", target: "userdata", value: 8, description: "控制機制從版權轉向數據" },
    
    // 跨時代連接 - 資料到未來
    { source: "algorithms", target: "aimusic", value: 10, description: "推薦算法發展為創作AI" },
    { source: "subscription", target: "nftmusic", value: 8, description: "從訂閱到所有權新模式" },
    { source: "userdata", target: "regulation", value: 10, description: "數據壟斷引發監管" },
    { source: "platformintegration", target: "superapps", value: 8, description: "平台整合發展為超級應用" },
    
    // 長跨時代連接
    { source: "bigfive", target: "spotify", value: 10, description: "唱片公司與串流平台整合" },
    { source: "vinyl", target: "nftmusic", value: 6, description: "實體收藏轉變為數位收藏" },
    { source: "mp3", target: "subscription", value: 8, description: "數位下載到流媒體的技術基礎" },
    { source: "indielabels", target: "decentralized", value: 6, description: "獨立發行演變為去中心化平台" }
  ]
};

// 定義不同類型節點的圖標和顏色
const getNodeColor = (group: string): string => {
  switch(group) {
    case 'hardware': return '#3498db';
    case 'software': return '#9b59b6';
    case 'data': return '#e67e22';
    case 'creator': return '#27ae60';
    case 'platform': return '#f1c40f';
    case 'service': return '#e74c3c';
    case 'future': return '#1abc9c';
    default: return '#95a5a6';
  }
};

// 定義不同時代的名稱和說明
const eraInfo = {
  hardware: {
    title: "硬體主導時代",
    period: "1950s-1990s",
    description: "實體媒介與硬體設備控制的時代，唱片公司通過掌握實體媒介生產與分發建立產業霸權。",
    color: "#3498db"
  },
  software: {
    title: "軟體主導時代",
    period: "1990s-2010s",
    description: "數位格式脫離實體媒介限制，軟體平台控制音樂消費體驗，網路革命重構音樂傳播路徑。",
    color: "#9b59b6"
  },
  data: {
    title: "資料主導時代",
    period: "2010-至今",
    description: "從擁有轉向訪問的消費模式，使用者行為資料成為核心資產，演算法推薦取代人工策展。",
    color: "#00bcd4"
  },
  future: {
    title: "未來趨勢",
    period: "2020s-",
    description: "去中心化與再集中化的拉鋸，AI創作、NFT和區塊鏈技術帶來潛在變革，但平台壟斷仍在強化。",
    color: "#4caf50"
  }
};

// 定義不同類型節點的類型說明
const nodeTypes = {
  medium: { label: "媒介", color: "#f39c12" },
  device: { label: "設備", color: "#e74c3c" },
  business: { label: "商業模式", color: "#27ae60" },
  platform: { label: "平台", color: "#8e44ad" },
  technology: { label: "技術", color: "#3498db" },
  software: { label: "軟體", color: "#9b59b6" },
  asset: { label: "資產", color: "#f1c40f" },
  policy: { label: "政策", color: "#7f8c8d" },
  channel: { label: "管道", color: "#16a085" }
};

// 互動式網絡圖組件
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
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'force'>('timeline');
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
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
    
    // 過濾時代
    if (filterEra !== "all") {
      nodes = nodes.filter(node => node.era === filterEra);
    }
    
    // 過濾類型
    if (filterType !== "all") {
      nodes = nodes.filter(node => node.type === filterType);
    }
    
    // 只顯示關鍵節點
    if (showOnlyKey) {
      nodes = nodes.filter(node => node.key);
    }
    
    // 過濾連接
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = graphData.links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );
    
    setFilteredData({ nodes, links });
  }, [filterEra, filterType, showOnlyKey]);
  
  // 計算時間軸佈局
  const calculateTimelineLayout = () => {
    // 基本尺寸參數
    const baseX = 50;
    const maxWidth = 900;
    const baseY = {
      hardware: 100,
      software: 300,
      data: 500,
      future: 700
    };
    
    // 時間範圍: 1940 - 2025
    const minYear = 1940;
    const maxYear = 2025;
    const yearSpan = maxYear - minYear;
    
    // 為節點分配位置
    const nodePositions = {};
    
    filteredData.nodes.forEach(node => {
      const year = parseInt(node.year, 10) || 2000;
      const normalizedYear = Math.max(minYear, Math.min(maxYear, year));
      
      // X軸基於年份
      const x = baseX + ((normalizedYear - minYear) / yearSpan) * maxWidth;
      
      // Y軸基於時代和類型
      let y = baseY[node.era] || 400;
      
      // 根據類型調整位置，防止重疊
      switch(node.type) {
        case 'medium': y -= 70; break;
        case 'device': y -= 40; break;
        case 'business': y += 40; break;
        case 'platform': y += 20; break;
        case 'technology': y -= 20; break;
        default: y += 0;
      }
      
      // 儲存位置
      nodePositions[node.id] = { x, y };
    });
    
    return nodePositions;
  };
  
  // 計算簡單力導向佈局
  const calculateForceLayout = () => {
    // 簡單的初始位置，實際項目中可使用d3-force等庫進行更複雜的力導向佈局
    const nodePositions = {};
    
    // 基於時代給予初始集群位置
    const basePositions = {
      hardware: { x: 200, y: 300 },
      software: { x: 500, y: 300 },
      data: { x: 800, y: 300 },
      future: { x: 1100, y: 300 }
    };
    
    // 在集群內分散節點
    filteredData.nodes.forEach((node, i) => {
      const base = basePositions[node.era] || { x: 500, y: 300 };
      // 添加一些隨機性避免重疊
      const angle = (i % 10) * (Math.PI * 2) / 10;
      const radius = 100 + (node.size || 10) * 3;
      
      nodePositions[node.id] = {
        x: base.x + Math.cos(angle) * radius,
        y: base.y + Math.sin(angle) * radius
      };
    });
    
    return nodePositions;
  };
  
  // 根據選擇的佈局模式計算節點位置
  const nodePositions = timeView ? calculateTimelineLayout() : calculateForceLayout();
  
  // 處理節點點擊
  const handleNodeClick = (node) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  };
  
  // 獲取兩節點間的連接
  const getLinksBetween = (nodeId1, nodeId2) => {
    return filteredData.links.filter(link => 
      (link.source === nodeId1 && link.target === nodeId2) ||
      (link.source === nodeId2 && link.target === nodeId1)
    );
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
  
  // 拖動處理
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...viewPosition };
    
    const handleMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      setViewPosition({
        x: startPos.x + dx / zoomLevel,
        y: startPos.y + dy / zoomLevel
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 渲染節點
  const renderNodes = () => {
    return filteredData.nodes.map((node: NodeType, i) => {
      const pos = nodePositions[node.id] || { x: 0, y: 0 };
      const isHighlighted = hoveredNode === node.id || selectedNode?.id === node.id;
      const isConnected = hoveredLink && (hoveredLink.source === node.id || hoveredLink.target === node.id);
      const scale = (node.impact || 1) * 0.5;
      const opacity = !hoveredNode || isHighlighted || isConnected ? 1 : 0.3;
      
      return (
        <g 
          key={node.id}
          transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
          opacity={opacity}
          cursor="pointer"
          onClick={() => handleNodeClick(node)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle 
            r={node.size / 2 || 8}
            fill={getNodeColor(node.group)}
            stroke={isHighlighted ? "#fff" : "none"}
            strokeWidth={2}
          />
          {(zoomLevel > 0.8 || isHighlighted) && (
            <text 
              y={node.size / 2 + 12}
              textAnchor="middle"
              fill="#333"
              fontSize={12}
              fontWeight={node.key ? "bold" : "normal"}
            >
              {node.name}
            </text>
          )}
        </g>
      );
    });
  };
  
  const renderLinks = () => {
    return filteredData.links.map((link, i) => {
      const source = nodePositions[link.source] || { x: 0, y: 0 };
      const target = nodePositions[link.target] || { x: 0, y: 0 };
      
      const isHighlighted = 
        (hoveredNode && (hoveredNode === link.source || hoveredNode === link.target)) ||
        (selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target));
      
      const opacity = !hoveredNode || isHighlighted ? 0.6 : 0.1;
      const strokeWidth = isHighlighted ? 2 : 1;
      
      // 生成唯一ID，用於懸停檢測
      const linkId = `link-${link.source}-${link.target}`;
      
      return (
        <g key={i} opacity={opacity}>
          <line
            id={linkId}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={isHighlighted ? "#333" : "#777"}
            strokeWidth={strokeWidth}
            onMouseEnter={() => setHoveredLink(link)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{ cursor: 'pointer' }}
          />
        </g>
      );
    });
  };
  
  // 渲染時間軸標記
  const renderTimelineMarkers = () => {
    if (!timeView) return null;
    
    const baseX = 50;
    const maxWidth = 900;
    const years = [1950, 1970, 1990, 2000, 2010, 2020];
    
    return (
      <g>
        <line x1={baseX} y1={50} x2={baseX} y2={800} stroke="#aaa" strokeWidth={1} />
        {years.map(year => {
          const x = baseX + ((year - 1940) / (2025 - 1940)) * maxWidth;
          return (
            <g key={year}>
              <line x1={x} y1={50} x2={x} y2={800} stroke="#ddd" strokeWidth={1} strokeDasharray="5,5" />
              <text x={x} y={40} textAnchor="middle" fill="#333" fontSize={12}>{year}</text>
            </g>
          );
        })}
        
        {/* 時代分隔線和標籤 */}
        <g>
          <line x1={baseX} y1={baseY.hardware} x2={baseX + maxWidth} y2={baseY.hardware} stroke="#ddd" strokeWidth={1} />
          <text x={baseX - 10} y={baseY.hardware + 5} textAnchor="end" fill={eraInfo.hardware.color} fontSize={14} fontWeight="bold">
            {eraInfo.hardware.title}
          </text>
        </g>
        <g>
          <line x1={baseX} y1={baseY.software} x2={baseX + maxWidth} y2={baseY.software} stroke="#ddd" strokeWidth={1} />
          <text x={baseX - 10} y={baseY.software + 5} textAnchor="end" fill={eraInfo.software.color} fontSize={14} fontWeight="bold">
            {eraInfo.software.title}
          </text>
        </g>
        <g>
          <line x1={baseX} y1={baseY.data} x2={baseX + maxWidth} y2={baseY.data} stroke="#ddd" strokeWidth={1} />
          <text x={baseX - 10} y={baseY.data + 5} textAnchor="end" fill={eraInfo.data.color} fontSize={14} fontWeight="bold">
            {eraInfo.data.title}
          </text>
        </g>
        <g>
          <line x1={baseX} y1={baseY.future} x2={baseX + maxWidth} y2={baseY.future} stroke="#ddd" strokeWidth={1} />
          <text x={baseX - 10} y={baseY.future + 5} textAnchor="end" fill={eraInfo.future.color} fontSize={14} fontWeight="bold">
            {eraInfo.future.title}
          </text>
        </g>
      </g>
    );
  };
  
  // 定義時代的Y軸基準位置
  const baseY = {
    hardware: 100,
    software: 300,
    data: 500,
    future: 700
  };
  
  // 查找與選定節點相關的連接
  const selectedNodeConnections = selectedNode ? getRelatedLinks(selectedNode.id) : [];
  
  // 查找與選定節點相關的節點
  const selectedNodeRelated = selectedNode ? 
    selectedNodeConnections.map(link => 
      link.source === selectedNode.id ? link.target : link.source
    ) : [];
  
  // 連接懸停提示
  const renderLinkTooltip = () => {
    if (!hoveredLink) return null;
    
    const source = nodePositions[hoveredLink.source] || { x: 0, y: 0 };
    const target = nodePositions[hoveredLink.target] || { x: 0, y: 0 };
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    return (
      <foreignObject x={midX - 100} y={midY - 40} width={200} height={80}>
        <div className="p-2 bg-white rounded shadow-md text-sm border border-gray-200">
          <p className="font-medium">{hoveredLink.description}</p>
        </div>
      </foreignObject>
    );
  };

  // 計算兩個節點間的距離
  const getDistance = (nodeId1: string, nodeId2: string) => {
    // ... existing code ...
  };

  // 獲取與某節點相連的所有節點
  const getConnectedNodes = (nodeId: string) => {
    // ... existing code ...
  };

  // 檢查兩個節點是否相連
  const areNodesConnected = (nodeId1: string, nodeId2: string) => {
    // ... existing code ...
  };

  // 切換佈局模式
  const toggleLayout = () => {
    setLayoutMode(layoutMode === 'timeline' ? 'force' : 'timeline');
  };
  
  // 過濾特定時代的節點
  const filterByEra = (era: string | null) => {
    setSelectedEra(era);
  };

  return (
    <div className="relative w-full h-[calc(100vh-220px)] min-h-[600px]">
      {/* 控制面板 */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700">
        <button 
          onClick={increaseZoom} 
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
          title="放大"
        >
          <ZoomIn size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button 
          onClick={decreaseZoom} 
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
          title="縮小"
        >
          <ZoomOut size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button 
          onClick={resetView} 
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
          title="重置視圖"
        >
          <RefreshCw size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button 
          onClick={() => setTimeView(!timeView)} 
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
          title={timeView ? '切換到力導向佈局' : '切換到時間軸佈局'}
        >
          {timeView ? (
            <Clock size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Share2 size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
      
      {/* 時代過濾器 */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white dark:bg-gray-900 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setFilterEra("all")} 
          className={`px-3 py-1 text-sm rounded-md ${filterEra === "all" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
        >
          全部
        </button>
        <button 
          onClick={() => setFilterEra("hardware")} 
          className={`px-3 py-1 text-sm rounded-md ${filterEra === "hardware" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          style={{borderLeft: `3px solid ${eraInfo.hardware.color}`}}
        >
          硬體時代
        </button>
        <button 
          onClick={() => setFilterEra("software")} 
          className={`px-3 py-1 text-sm rounded-md ${filterEra === "software" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          style={{borderLeft: `3px solid ${eraInfo.software.color}`}}
        >
          軟體時代
        </button>
        <button 
          onClick={() => setFilterEra("data")} 
          className={`px-3 py-1 text-sm rounded-md ${filterEra === "data" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          style={{borderLeft: `3px solid ${eraInfo.data.color}`}}
        >
          資料時代
        </button>
        <button 
          onClick={() => setFilterEra("future")} 
          className={`px-3 py-1 text-sm rounded-md ${filterEra === "future" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          style={{borderLeft: `3px solid ${eraInfo.future.color}`}}
        >
          未來趨勢
        </button>
      </div>
      
      {/* 節點詳情面板 */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 max-w-md">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{selectedNode.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              {selectedNode.type || '未分類'}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              {selectedNode.year || '未知年份'}
            </span>
            {selectedNode.era && (
              <span className="px-2 py-1 rounded-full" style={{backgroundColor: getNodeColor(selectedNode.group) + '20', color: getNodeColor(selectedNode.group)}}>
                {eraInfo[selectedNode.era]?.title || selectedNode.era}
              </span>
            )}
          </div>
          {selectedNode.description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{selectedNode.description}</p>
          )}
          {selectedNode.stats && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedNode.stats}</p>
            </div>
          )}
          <button 
            onClick={() => setSelectedNode(null)} 
            className="mt-3 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            關閉
          </button>
        </div>
      )}
      
      {/* 圖例 */}
      <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-900 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">圖例</h4>
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showLegend ? '隱藏' : '顯示'}
          </button>
        </div>
        {showLegend && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: eraInfo.hardware.color}}></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">硬體時代</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: eraInfo.software.color}}></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">軟體時代</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: eraInfo.data.color}}></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">資料時代</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: eraInfo.future.color}}></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">未來趨勢</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 視覺化畫布 */}
      <svg
        ref={svgRef}
        className="w-full h-full bg-white dark:bg-gray-800"
        viewBox="0 0 1000 800"
        style={{
          transform: `scale(${zoomLevel}) translate(${viewPosition.x}px, ${viewPosition.y}px)`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleMouseDown}
      >
        <g>
          {renderTimelineMarkers()}
          {renderLinks()}
          {renderNodes()}
          {renderLinkTooltip()}
        </g>
      </svg>
    </div>
  );
};

export default MusicIndustryNetworkGraph;
