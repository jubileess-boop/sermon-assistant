'use client'

import { useState, useEffect, useRef } from "react";

const VERSE_COUNTS = {
  "창세기":    [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
  "출애굽기":  [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
  "레위기":    [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],
  "민수기":    [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
  "신명기":    [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
  "여호수아":  [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  "사사기":    [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  "룻기":      [22,23,18,22],
  "사무엘상":  [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
  "사무엘하":  [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
  "열왕기상":  [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
  "열왕기하":  [18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
  "역대상":    [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
  "역대하":    [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
  "에스라":    [11,70,13,24,17,22,28,36,15,44],
  "느헤미야":  [11,20,32,23,19,19,73,18,38,39,36,47,31],
  "에스더":    [22,28,23,31,26,20,20,29,37,22],
  "욥기":      [22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
  "시편":      [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,20,28,22,35,22,20,43,11,13,5,26,17,11,9,6,92,37,31,15,9,14,17,15,17,12,15,14,10,13,13,18,30,9,20,9,21,14,7,15,7,8,6,13,6,11,11,11,8,12,18,37,8,22,21,31,16,22,24,14,22,13,14,5,6,31,34,21,13],
  "잠언":      [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
  "전도서":    [18,26,22,16,20,12,29,17,18,20,10,14],
  "아가":      [17,17,11,16,16,13,13,14],
  "이사야":    [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
  "예레미야":  [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
  "예레미야애가":[22,22,66,22,22],
  "에스겔":    [28,10,27,21,17,17,14,20,28,22,35,22,22,21,22,17,22,16,21,22,29,29,19,37,25,28,22,22,18,29,34,27,27,16,34,28,38,23,16,23,21,21,20,25,25,16,29,23],
  "다니엘":    [21,49,30,37,31,28,28,27,27,21,45,13],
  "호세아":    [11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  "요엘":      [20,32,21],
  "아모스":    [15,16,15,13,27,14,17,14,15],
  "오바댜":    [21],
  "요나":      [17,10,10,11],
  "미가":      [16,13,12,13,15,16,20],
  "나훔":      [15,13,19],
  "하박국":    [17,20,19],
  "스바냐":    [18,15,20],
  "학개":      [15,23],
  "스가랴":    [21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  "말라기":    [14,17,18,6],
  "마태복음":  [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
  "마가복음":  [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
  "누가복음":  [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
  "요한복음":  [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
  "사도행전":  [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
  "로마서":    [32,29,31,25,21,23,25,39,33,21,36,21,14,26,33,24],
  "고린도전서":[31,16,23,21,13,20,40,34,24,19,14,12,23,39,21,13],
  "고린도후서":[24,17,18,18,21,20,20,16,21,13,19,33,19],
  "갈라디아서":[24,21,29,31,26,18],
  "에베소서":  [23,22,21,28,20,32],
  "빌립보서":  [30,20,25,19],
  "골로새서":  [23,14,22,23],
  "데살로니가전서":[10,20,13,18,28],
  "데살로니가후서":[12,17,18],
  "디모데전서":[20,15,16,16,25,21],
  "디모데후서":[18,26,17,22],
  "디도서":    [16,15,15],
  "빌레몬서":  [25],
  "히브리서":  [14,18,19,16,14,20,28,13,28,39,40,29,25],
  "야고보서":  [27,26,18,17,20],
  "베드로전서":[25,25,22,19,14],
  "베드로후서":[21,22,18],
  "요한일서":  [10,29,24,21,21],
  "요한이서":  [13],
  "요한삼서":  [14],
  "유다서":    [25],
  "요한계시록":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21],
};

// ── 성경책 약어 매핑 (bible_kor.json 키 형식) ──
var BOOK_ABBR = {
  "창세기":"창","출애굽기":"출","레위기":"레","민수기":"민","신명기":"신",
  "여호수아":"수","사사기":"삿","룻기":"룻","사무엘상":"삼상","사무엘하":"삼하",
  "열왕기상":"왕상","열왕기하":"왕하","역대상":"대상","역대하":"대하",
  "에스라":"스","느헤미야":"느","에스더":"에","욥기":"욥","시편":"시",
  "잠언":"잠","전도서":"전","아가":"아","이사야":"사","예레미야":"렘",
  "예레미야애가":"애","에스겔":"겔","다니엘":"단","호세아":"호","요엘":"욜",
  "아모스":"암","오바댜":"옵","요나":"욘","미가":"미","나훔":"나",
  "하박국":"합","스바냐":"습","학개":"학","스가랴":"슥","말라기":"말",
  "마태복음":"마","마가복음":"막","누가복음":"눅","요한복음":"요",
  "사도행전":"행","로마서":"롬","고린도전서":"고전","고린도후서":"고후",
  "갈라디아서":"갈","에베소서":"엡","빌립보서":"빌","골로새서":"골",
  "데살로니가전서":"살전","데살로니가후서":"살후","디모데전서":"딤전",
  "디모데후서":"딤후","디도서":"딛","빌레몬서":"몬","히브리서":"히",
  "야고보서":"약","베드로전서":"벧전","베드로후서":"벧후","요한일서":"요일",
  "요한이서":"요이","요한삼서":"요삼","유다서":"유","요한계시록":"계",
};

// 약어 → KJV book 번호
var KJV_BOOK_NUM = {
  "창":1,"출":2,"레":3,"민":4,"신":5,"수":6,"삿":7,"룻":8,"삼상":9,"삼하":10,
  "왕상":11,"왕하":12,"대상":13,"대하":14,"스":15,"느":16,"에":17,"욥":18,"시":19,
  "잠":20,"전":21,"아":22,"사":23,"렘":24,"애":25,"겔":26,"단":27,"호":28,"욜":29,
  "암":30,"옵":31,"욘":32,"미":33,"나":34,"합":35,"습":36,"학":37,"슥":38,"말":39,
  "마":40,"막":41,"눅":42,"요":43,"행":44,"롬":45,"고전":46,"고후":47,"갈":48,
  "엡":49,"빌":50,"골":51,"살전":52,"살후":53,"딤전":54,"딤후":55,"딛":56,"몬":57,
  "히":58,"약":59,"벧전":60,"벧후":61,"요일":62,"요이":63,"요삼":64,"유":65,"계":66,
};

// ── 성경 JSON 캐시 ──
var _bibleKorCache = null;
var _bibleKjvCache = null;

async function loadBibleKor() {
  if (_bibleKorCache) return _bibleKorCache;
  try {
    var res = await fetch('/bible_kor.json');
    if (res.ok) { _bibleKorCache = await res.json(); return _bibleKorCache; }
  } catch(e) {}
  return null;
}

async function loadBibleKjv() {
  if (_bibleKjvCache) return _bibleKjvCache;
  try {
    var res = await fetch('/bible_kjv.json');
    if (res.ok) {
      var data = await res.json();
      // 빠른 조회를 위해 인덱싱
      var idx = {};
      (data.verses||[]).forEach(function(v){
        idx[v.book+":"+v.chapter+":"+v.verse] = v.text.replace(/[¶‹›\[\]]/g,'').trim();
      });
      _bibleKjvCache = idx;
      return _bibleKjvCache;
    }
  } catch(e) {}
  return null;
}

function getKorVerse(bibleData, bookName, chap, verse) {
  if (!bibleData) return null;
  var abbr = BOOK_ABBR[bookName];
  if (!abbr) return null;
  var key = abbr + chap + ":" + verse;
  return bibleData[key] || null;
}

function getKjvVerse(kjvIndex, bookName, chap, verse) {
  if (!kjvIndex) return null;
  var abbr = BOOK_ABBR[bookName];
  if (!abbr) return null;
  var bookNum = KJV_BOOK_NUM[abbr];
  if (!bookNum) return null;
  return kjvIndex[bookNum+":"+chap+":"+verse] || null;
}

const BIBLE_BOOKS = {
  구약: [
    {name:"창세기",en:"genesis",chapters:50},{name:"출애굽기",en:"exodus",chapters:40},
    {name:"레위기",en:"leviticus",chapters:27},{name:"민수기",en:"numbers",chapters:36},
    {name:"신명기",en:"deuteronomy",chapters:34},{name:"여호수아",en:"joshua",chapters:24},
    {name:"사사기",en:"judges",chapters:21},{name:"룻기",en:"ruth",chapters:4},
    {name:"사무엘상",en:"1 samuel",chapters:31},{name:"사무엘하",en:"2 samuel",chapters:24},
    {name:"열왕기상",en:"1 kings",chapters:22},{name:"열왕기하",en:"2 kings",chapters:25},
    {name:"역대상",en:"1 chronicles",chapters:29},{name:"역대하",en:"2 chronicles",chapters:36},
    {name:"에스라",en:"ezra",chapters:10},{name:"느헤미야",en:"nehemiah",chapters:13},
    {name:"에스더",en:"esther",chapters:10},{name:"욥기",en:"job",chapters:42},
    {name:"시편",en:"psalms",chapters:150},{name:"잠언",en:"proverbs",chapters:31},
    {name:"전도서",en:"ecclesiastes",chapters:12},{name:"아가",en:"song of solomon",chapters:8},
    {name:"이사야",en:"isaiah",chapters:66},{name:"예레미야",en:"jeremiah",chapters:52},
    {name:"예레미야애가",en:"lamentations",chapters:5},{name:"에스겔",en:"ezekiel",chapters:48},
    {name:"다니엘",en:"daniel",chapters:12},{name:"호세아",en:"hosea",chapters:14},
    {name:"요엘",en:"joel",chapters:3},{name:"아모스",en:"amos",chapters:9},
    {name:"오바댜",en:"obadiah",chapters:1},{name:"요나",en:"jonah",chapters:4},
    {name:"미가",en:"micah",chapters:7},{name:"나훔",en:"nahum",chapters:3},
    {name:"하박국",en:"habakkuk",chapters:3},{name:"스바냐",en:"zephaniah",chapters:3},
    {name:"학개",en:"haggai",chapters:2},{name:"스가랴",en:"zechariah",chapters:14},
    {name:"말라기",en:"malachi",chapters:4},
  ],
  신약: [
    {name:"마태복음",en:"matthew",chapters:28},{name:"마가복음",en:"mark",chapters:16},
    {name:"누가복음",en:"luke",chapters:24},{name:"요한복음",en:"john",chapters:21},
    {name:"사도행전",en:"acts",chapters:28},{name:"로마서",en:"romans",chapters:16},
    {name:"고린도전서",en:"1 corinthians",chapters:16},{name:"고린도후서",en:"2 corinthians",chapters:13},
    {name:"갈라디아서",en:"galatians",chapters:6},{name:"에베소서",en:"ephesians",chapters:6},
    {name:"빌립보서",en:"philippians",chapters:4},{name:"골로새서",en:"colossians",chapters:4},
    {name:"데살로니가전서",en:"1 thessalonians",chapters:5},{name:"데살로니가후서",en:"2 thessalonians",chapters:3},
    {name:"디모데전서",en:"1 timothy",chapters:6},{name:"디모데후서",en:"2 timothy",chapters:4},
    {name:"디도서",en:"titus",chapters:3},{name:"빌레몬서",en:"philemon",chapters:1},
    {name:"히브리서",en:"hebrews",chapters:13},{name:"야고보서",en:"james",chapters:5},
    {name:"베드로전서",en:"1 peter",chapters:5},{name:"베드로후서",en:"2 peter",chapters:3},
    {name:"요한일서",en:"1 john",chapters:5},{name:"요한이서",en:"2 john",chapters:1},
    {name:"요한삼서",en:"3 john",chapters:1},{name:"유다서",en:"jude",chapters:1},
    {name:"요한계시록",en:"revelation",chapters:22},
  ],
};
const ALL_BOOKS = [...BIBLE_BOOKS.구약, ...BIBLE_BOOKS.신약];

const LEVELS = {
  children:{label:"유치부",emoji:"🌱",age:"5~7세",color:"#D97706",gradient:"linear-gradient(135deg,#F59E0B,#D97706)",bg:"#FFFBEB",border:"#FDE68A"},
  youth:   {label:"청소년부",emoji:"🔥",age:"13~19세",color:"#4F46E5",gradient:"linear-gradient(135deg,#6366F1,#4F46E5)",bg:"#EEF2FF",border:"#C7D2FE"},
  adult:   {label:"성인부",emoji:"✝️",age:"20세 이상",color:"#1D4ED8",gradient:"linear-gradient(135deg,#2563EB,#1D4ED8)",bg:"#EFF6FF",border:"#BFDBFE"},
};

// 키아즘 프레임 옵션
// 설교 주제 카테고리
var SERMON_TOPICS = [
  {value:"하나님",   label:"하나님",   emoji:"✝️",  color:"#1D4ED8"},
  {value:"그리스도", label:"그리스도", emoji:"🕊️", color:"#7C3AED"},
  {value:"성령님",   label:"성령님",   emoji:"🔥",  color:"#EA580C"},
  {value:"인간",     label:"인간",     emoji:"🧑",  color:"#0F766E"},
  {value:"교회",     label:"교회",     emoji:"⛪",  color:"#4F46E5"},
  {value:"구원",     label:"구원",     emoji:"🙏",  color:"#B45309"},
  {value:"종말",     label:"종말",     emoji:"⏳",  color:"#BE123C"},
];

const CHIASM_FRAMES = [
  {value:"5", label:"5단 (A-B-C-B'-A')"},
  {value:"6", label:"6단 (A-B-C-C'-B'-A')"},
  {value:"7", label:"7단 (A-B-C-D-C'-B'-A')"},
  {value:"8", label:"8단 (A-B-C-D-D'-C'-B'-A')"},
  {value:"9", label:"9단 (A-B-C-D-E-D'-C'-B'-A')"},
  {value:"10",label:"10단 (A-B-C-D-E-E'-D'-C'-B'-A')"},
  {value:"11",label:"11단 (A-B-C-D-E-F-E'-D'-C'-B'-A')"},
  {value:"12",label:"12단 (A-B-C-D-E-F-F'-E'-D'-C'-B'-A')"},
  {value:"13",label:"13단 (A-B-C-D-E-F-G-F'-E'-D'-C'-B'-A')"},
];

// 키아즘 단수에 따른 라벨 생성
function getChiasmLabels(n) {
  const num = parseInt(n);
  const half = Math.floor(num / 2);
  const hasCenter = num % 2 === 1;
  const labels = [];
  const alpha = ["A","B","C","D","E","F","G","H","I","J"];
  for (let i = 0; i < half; i++) labels.push(alpha[i]);
  if (hasCenter) labels.push(alpha[half] + " (중심)");
  for (let i = half - 1; i >= 0; i--) labels.push(alpha[i] + "'");
  return labels;
}

const FORMAT_PROMPTS = {
  children:`반드시 아래 형식으로 답변하세요:
## 📖 오늘의 말씀 이야기
(구절 내용을 어린이 눈높이로 3~4줄)
## 🎯 오늘의 핵심 메시지
(한 문장 핵심 메시지)
## 📚 설교 내용
### 마음 열기
(흥미로운 질문이나 이야기 3~4줄)
### 말씀 나누기
(쉬운 말로 성경 내용 5~6줄)
### 우리 생활에서
(어린이 실천 예시 2~3가지)
## 🙏 함께 드리는 기도
(어린이와 함께 읽는 기도문 3~4줄)
## 🎨 오늘의 활동 아이디어
(설교 연결 활동 1~2가지)`,
  youth:`반드시 아래 형식으로 답변하세요:
## 📖 오늘의 말씀
(구절 핵심 내용과 배경 3~4줄)
## 💡 핵심 메시지
(핵심 메시지 1~2가지)
## 📚 설교 목차
### 1부: 공감 — 우리의 이야기
(청소년이 공감할 상황·질문 4~5줄)
### 2부: 말씀 — 하나님의 이야기
(성경 본문 의미와 배경 6~7줄)
### 3부: 적용 — 내 이야기로
(청소년 삶 적용 도전 4~5줄)
## ✅ 이번 주 도전 과제
(실천 과제 3가지)
## 🙏 중보기도 제목
(청소년을 위한 기도 제목 3가지)
## 💬 소그룹 나눔 질문
(소그룹 나눔 질문 2~3개)`,
  adult:`반드시 아래 형식으로 답변하세요:
## 📖 본문 말씀
(구절 원문 의미와 역사/문화적 배경 4~5줄)
## 🎯 설교 제목 추천 3가지
1. (제목 1)
2. (제목 2)
3. (제목 3)
## 📚 설교 목차
### 서론: 문제 제기
(삶의 현실적 질문으로 시작 4~5줄)
### 본론 1: 말씀의 배경
(역사적·신학적 배경 5~6줄)
### 본론 2: 말씀의 의미
(핵심 메시지와 원어 의미 5~6줄)
### 본론 3: 오늘의 적용
(현대 성도 삶에 적용 5~6줄)
### 결론: 결단과 헌신
(도전과 결단으로 마무리 3~4줄)
## 🔗 연계 성경 구절
(관련 구절 3~4개와 설명)
## 🙏 대표기도 가이드
(설교 주제 맞는 기도 흐름 5~6줄)
## 📝 적용 질문
(소그룹·가정예배용 질문 3~4개)`,
};

// ── File System Access API ──
var _dirHandle = null;
var BACKUP_FILENAME = "설교비서_백업.json";
var FS_API_SUPPORTED = typeof window !== "undefined" && "showDirectoryPicker" in window;

async function pickSaveFolder() {
  try {
    var handle = await window.showDirectoryPicker({ mode:"readwrite", startIn:"documents" });
    _dirHandle = handle;
    try { localStorage.setItem("sermon-fs-folderName", handle.name); } catch(e) {}
    return handle;
  } catch(e) { return null; }
}

async function saveToFolder(jsonStr) {
  if (!_dirHandle) return false;
  try {
    var fh = await _dirHandle.getFileHandle(BACKUP_FILENAME, { create:true });
    var w  = await fh.createWritable();
    var blob = new Blob([new TextEncoder().encode(jsonStr)], { type:"application/json;charset=utf-8" });
    await w.write(blob); await w.close();
    return true;
  } catch(e) { _dirHandle = null; return false; }
}

function downloadAsFile(filename, content) {
  var blob = new Blob([new TextEncoder().encode(content)], { type:"application/json;charset=utf-8" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

async function storageSave(key, value) {
  var json = JSON.stringify(value);
  try { localStorage.setItem("sermon:" + key, json); } catch(e) {}
}

async function storageLoad(key) {
  try { var v = localStorage.getItem("sermon:" + key); if (v) return JSON.parse(v); } catch(e) {}
  try { var v2 = localStorage.getItem(key); if (v2) { storageSave(key, JSON.parse(v2)); return JSON.parse(v2); } } catch(e2) {}
  return null;
}

function getVerseCount(bookName, chapNum) {
  var arr = VERSE_COUNTS[bookName];
  if (!arr) return 30;
  return arr[chapNum - 1] || 30;
}

function buildVerseList(book, fc, fv, tc, tv) {
  var list = [];
  for (var c = fc; c <= tc; c++) {
    var maxV = getVerseCount(book, c);
    var sv = (c === fc) ? fv : 1;
    var ev = (c === tc) ? Math.min(tv, maxV) : maxV;
    for (var v = sv; v <= ev; v++) list.push({chap:c, verse:v});
  }
  return list;
}

function makeRefLabel(book, fc, fv, tc, tv) {
  if (!book||!fc||!fv||!tc||!tv) return "";
  if (fc===tc) return fv===tv?(book+" "+fc+"장 "+fv+"절"):(book+" "+fc+"장 "+fv+"~"+tv+"절");
  return book+" "+fc+"장 "+fv+"절 ~ "+tc+"장 "+tv+"절";
}

async function callClaude(system, userMsg, maxTokens) {
  var res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:maxTokens||400, system:system, messages:[{role:"user",content:userMsg}]}),
  });
  if (!res.ok){var err=await res.json().catch(function(){return {};});throw new Error((err&&err.error&&err.error.message)||("HTTP "+res.status));}
  var data=await res.json();
  return (data.content&&data.content[0]&&data.content[0].text)||"";
}

function makeSystemPrompt(levelKey, styleProfile) {
  var base={children:"당신은 유치부(5~7세) 전문 설교 작성 도우미입니다.",youth:"당신은 청소년부(중고등학생) 전문 설교 작성 도우미입니다.",adult:"당신은 성인 예배 전문 설교 작성 도우미입니다."}[levelKey];
  var styleSection="";
  if(styleProfile){styleSection="\n\n[이 목사님의 고유 설교 스타일을 반드시 반영하세요]\n- 설교 스타일: "+styleProfile.preachingStyle+"\n- 언어 톤/어조: "+styleProfile.toneAndVoice+"\n- 구조 패턴: "+styleProfile.structurePattern+"\n- 신학적 강조: "+styleProfile.theologicalEmphasis+"\n- 자주 쓰는 표현: "+styleProfile.keyPhrases+"\n- 적용 방식: "+styleProfile.applicationStyle;}
  return base+styleSection+"\n\n"+FORMAT_PROMPTS[levelKey];
}

function extractText(file) {
  var ext=file.name.split(".").pop().toLowerCase();
  if(ext==="txt")return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(e){resolve(e.target.result.trim());};r.onerror=function(){reject(new Error("파일 읽기 실패"));};r.readAsText(file,"UTF-8");});
  if(ext==="pdf")return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(e){var lib=window["pdfjs-dist/build/pdf"];if(!lib){reject(new Error("PDF 라이브러리 미로드"));return;}lib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";lib.getDocument({data:e.target.result}).promise.then(function(pdf){var pages=[];for(var i=1;i<=pdf.numPages;i++)pages.push(i);return pages.reduce(function(acc,n){return acc.then(function(t){return pdf.getPage(n).then(function(p){return p.getTextContent().then(function(c){return t+c.items.map(function(x){return x.str;}).join(" ")+"\n";});});});},Promise.resolve(""));}).then(resolve).catch(reject);};r.onerror=function(){reject(new Error("파일 읽기 실패"));};r.readAsArrayBuffer(file);});
  if(ext==="docx")return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(e){var m=window.mammoth;if(!m){reject(new Error("DOCX 라이브러리 미로드"));return;}m.extractRawText({arrayBuffer:e.target.result}).then(function(res){resolve(res.value.trim());}).catch(reject);};r.onerror=function(){reject(new Error("파일 읽기 실패"));};r.readAsArrayBuffer(file);});
  return Promise.reject(new Error("지원하지 않는 파일 형식입니다."));
}

function renderMd(text) {
  return text.split("\n").map(function(line,i){
    if(line.indexOf("## ")===0)return <h2 key={i} style={sy.h2}>{line.slice(3)}</h2>;
    if(line.indexOf("### ")===0)return <h3 key={i} style={sy.h3}>{line.slice(4)}</h3>;
    if(/^\d+\./.test(line))return <p key={i} style={sy.li}>{line}</p>;
    if(line.indexOf("- ")===0)return <p key={i} style={sy.bullet}>{"• "+line.slice(2)}</p>;
    if(!line.trim())return <div key={i} style={{height:6}}/>;
    return <p key={i} style={sy.para}>{line}</p>;
  });
}

var STORAGE_SERMONS="sermons-v1";
var STORAGE_LIBRARY="library-v1";

export default function App() {
  const [mainTab,   setMainTab]   = useState("bible");
  const [storageReady,setStorageReady]=useState(false);
  const [folderName,       setFolderName]       = useState("");
  const [folderStatus,     setFolderStatus]     = useState("");
  const [showFolderBanner, setShowFolderBanner] = useState(false);
  const [saveStatus,setSaveStatus]=useState("");

  // 성경
  const [book,      setBook]      = useState("");
  const [fromChap,  setFromChap]  = useState("");
  const [fromVerse, setFromVerse] = useState("");
  const [toChap,    setToChap]    = useState("");
  const [toVerse,   setToVerse]   = useState("");
  const [level,     setLevel]     = useState("adult");

  // 말씀
  const [korLines,  setKorLines]  = useState([]);
  const [engText,   setEngText]   = useState("");
  const [korCtx,    setKorCtx]    = useState("");
  const [themes,    setThemes]    = useState([]);
  const [showLang,  setShowLang]  = useState("both");
  const [vLoading,  setVLoading]  = useState(false);
  const [vError,    setVError]    = useState("");
  const [loaded,    setLoaded]    = useState(0);
  const [total,     setTotal]     = useState(0);

  // 설교
  const [sermonOut, setSermonOut] = useState("");
  const [sLoading,  setSLoading]  = useState(false);

  // ── 키아즘 연구 ──
  const [showChiasm,      setShowChiasm]      = useState(false);
  const [chiasmTitle,     setChiasmTitle]     = useState("");
  const [chiasmFrame,     setChiasmFrame]     = useState("7");
  const [chiasmCenter,    setChiasmCenter]    = useState("");
  const [chiasmStructure, setChiasmStructure] = useState({});
  const [chiasmAnalysis,  setChiasmAnalysis]  = useState("");
  const [chiasmLoading,   setChiasmLoading]   = useState(false);
  const [savedChiasms,    setSavedChiasms]    = useState([]);
  const [viewChiasm,      setViewChiasm]      = useState(null);
  const [chiasmMemo,          setChiasmMemo]          = useState("");
  const [chiasmDeleteConfirm, setChiasmDeleteConfirm] = useState(null);

  // 저장 설교
  const [savedSermons,  setSavedSermons]   = useState([]);
  const [saveTitle,     setSaveTitle]      = useState("");
  const [showSaveModal, setShowSaveModal]  = useState(false);
  const [saveMsg,       setSaveMsg]        = useState("");
  const [viewSermon,    setViewSermon]     = useState(null);
  const [searchQuery,   setSearchQuery]    = useState("");
  const [filterLevel,   setFilterLevel]   = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // 라이브러리
  const [library,    setLibrary]    = useState([]);
  const [activeLib,  setActiveLib]  = useState(null);
  const [upName,     setUpName]     = useState("");
  const [upFiles,    setUpFiles]    = useState([]);
  const [upLoading,  setUpLoading]  = useState(false);
  const [upError,    setUpError]    = useState("");
  const [upProgress, setUpProgress] = useState("");
  const [upBookCat,  setUpBookCat]  = useState("");
  const [upTopics,   setUpTopics]   = useState([]);
  const [libSubTab,  setLibSubTab]  = useState("upload");
  const [libSearch,  setLibSearch]  = useState("");
  const [libBookFilter, setLibBookFilter] = useState("");
  const [libTopicFilter,setLibTopicFilter]= useState("");
  const [libOpenId,  setLibOpenId]  = useState(null);
  const fileRef = useRef();

  var bookInfo    = ALL_BOOKS.find(function(b){return b.name===book;});
  var maxChap     = bookInfo?bookInfo.chapters:0;
  var toChapOpts  = fromChap?Array.from({length:maxChap-parseInt(fromChap)+1},function(_,i){return i+parseInt(fromChap);}):[];
  var fromVerseMax = fromChap?getVerseCount(book,parseInt(fromChap)):30;
  var toVerseMax   = toChap?getVerseCount(book,parseInt(toChap)):30;
  var toVerseOpts  = toChap?(parseInt(toChap)===parseInt(fromChap)&&fromVerse?Array.from({length:toVerseMax-parseInt(fromVerse)+1},function(_,i){return i+parseInt(fromVerse);}):Array.from({length:toVerseMax},function(_,i){return i+1;})):[];
  var refLabel    = makeRefLabel(book,parseInt(fromChap),parseInt(fromVerse),parseInt(toChap),parseInt(toVerse));
  var verseReady  = korLines.length>0&&!vLoading;
  var activeLibObj = library.find(function(l){return l.id===activeLib;})||null;
  var lv = LEVELS[level];
  var chiasmLabels = getChiasmLabels(chiasmFrame);

  var filteredSermons = savedSermons.filter(function(s){
    var mSearch=!searchQuery||(s.title.indexOf(searchQuery)>-1)||(s.refLabel.indexOf(searchQuery)>-1)||(s.content.indexOf(searchQuery)>-1);
    var mLevel=filterLevel==="all"||s.level===filterLevel;
    return mSearch&&mLevel;
  });

  useEffect(function(){
    async function init(){
      // 저장 모드 감지
      var s=await storageLoad(STORAGE_SERMONS);if(s&&Array.isArray(s))setSavedSermons(s);
      var l=await storageLoad(STORAGE_LIBRARY);if(l&&Array.isArray(l))setLibrary(l);
      var c=await storageLoad("chiasms-v1");if(c&&Array.isArray(c))setSavedChiasms(c);
      var fn=typeof window!=="undefined"?localStorage.getItem("sermon-fs-folderName"):null;
      if(fn){setFolderName(fn);setShowFolderBanner(true);}
      else if(FS_API_SUPPORTED){setShowFolderBanner(true);}
      setStorageReady(true);
    }
    init();
  },[]);

  useEffect(function(){setFromChap("");setFromVerse("");setToChap("");setToVerse("");clearVerse();},[book]);
  useEffect(function(){setFromVerse("");setToChap("");setToVerse("");clearVerse();},[fromChap]);
  useEffect(function(){setToChap("");setToVerse("");clearVerse();},[fromVerse]);
  useEffect(function(){setToVerse("");clearVerse();},[toChap]);
  useEffect(function(){if(book&&fromChap&&fromVerse&&toChap&&toVerse)fetchVerses();},[toVerse]);

  // 프레임 변경 시 구조 초기화
  useEffect(function(){setChiasmStructure({});},[chiasmFrame]);

  function clearVerse(){setKorLines([]);setEngText("");setKorCtx("");setThemes([]);setVError("");setSermonOut("");setLoaded(0);setTotal(0);setChiasmAnalysis("");setChiasmMemo("");setShowChiasm(false);}

  // ── 말씀 불러오기 ──
  async function fetchVerses(){
    setVLoading(true);setVError("");setKorLines([]);setEngText("");setSermonOut("");setChiasmAnalysis("");setChiasmMemo("");
    var list=buildVerseList(book,parseInt(fromChap),parseInt(fromVerse),parseInt(toChap),parseInt(toVerse));
    setTotal(list.length);setLoaded(0);
    var results=[];

    // ── 캐시 키 생성 ──
    var cacheKey="verse-cache:"+book+":"+fromChap+":"+fromVerse+":"+toChap+":"+toVerse;
    var cacheCtxKey="verse-ctx:"+book+":"+fromChap+":"+fromVerse+":"+toChap+":"+toVerse;

    // ── 캐시 확인 ──
    var cached=await storageLoad(cacheKey);
    if(cached&&cached.korLines&&cached.korLines.length>0){
      // 캐시 히트! 즉시 표시
      setKorLines(cached.korLines);
      setLoaded(cached.korLines.length);
      if(cached.engText) setEngText(cached.engText);
      var cachedCtx=await storageLoad(cacheCtxKey);
      if(cachedCtx){
        setKorCtx(cachedCtx.context||"");
        setThemes(cachedCtx.themes||[]);
      }
      setVLoading(false);
      return;
    }

    // ── 캐시 없음 → JSON 파일 또는 API로 로드 ──
    var bibleKor=await loadBibleKor();
    var bibleKjv=await loadBibleKjv();
    var engResult="";

    if(bibleKor){
      // JSON 파일에서 즉시 로드 (API 불필요!)
      for(var i=0;i<list.length;i++){
        var item=list[i];
        var verseText=getKorVerse(bibleKor,book,item.chap,item.verse);
        results.push(item.verse+" "+(verseText?verseText.trim():"(본문 없음)"));
        setKorLines(results.slice());
        setLoaded(results.length);
      }
      // KJV도 JSON에서 로드
      if(bibleKjv){
        var kjvLines=[];
        for(var j=0;j<list.length;j++){
          var jitem=list[j];
          var kjvText=getKjvVerse(bibleKjv,book,jitem.chap,jitem.verse);
          if(kjvText) kjvLines.push(jitem.verse+" "+kjvText);
        }
        if(kjvLines.length>0){engResult=kjvLines.join("\n");setEngText(engResult);}
      }
    } else {
      // JSON 없으면 API 방식
      try{
        for(var i=0;i<list.length;i++){
          var item=list[i];
          var text=await callClaude(
            "너는 한국어 개역개정 성경 본문을 정확히 제공하는 도우미야. 요청한 절의 개역개정 본문만 한 줄로 출력해. 형식: \""+item.verse+" 본문내용\" 다른 설명 없이 본문만 출력해.",
            book+" "+item.chap+"장 "+item.verse+"절 개역개정 본문", 300
          );
          var t=text.trim();
          results.push(t.indexOf(String(item.verse))===0?t:(item.verse+" "+t));
          setKorLines(results.slice());setLoaded(results.length);
        }
      }catch(e){setVError("말씀 오류: "+e.message);setVLoading(false);return;}
      try{
        if(parseInt(fromChap)===parseInt(toChap)){
          var enBook=(bookInfo?bookInfo.en:"").replace(/ /g,"+");
          var passage=parseInt(fromVerse)===parseInt(toVerse)?(enBook+"+"+fromChap+":"+fromVerse):(enBook+"+"+fromChap+":"+fromVerse+"-"+toVerse);
          var res=await fetch("https://bible-api.com/"+passage+"?translation=kjv");
          if(res.ok){var d=await res.json();engResult=(d.text||"").trim();setEngText(engResult);}
        }
      }catch(e3){}
    }

    // ── 성구 캐시 저장 ──
    try{await storageSave(cacheKey,{korLines:results.length>0?results:list.map(function(_,i){return "";}),engText:engResult});}catch(e){}

    // 배경/주제는 AI로 생성 후 캐시
    try{
      var ctxRaw=await callClaude("너는 성경 구절 배경을 설명하는 도우미야. 반드시 순수 JSON만 출력해. {\"context\":\"배경 1~2줄\",\"theme\":\"키워드1,키워드2,키워드3\"}",refLabel+" 배경과 주제",250);
      var parsed=JSON.parse(ctxRaw.replace(/```json|```/g,"").trim());
      var ctx=parsed.context||"";
      var thms=(parsed.theme||"").split(/[,，·]+/).map(function(t){return t.trim();}).filter(Boolean);
      setKorCtx(ctx);setThemes(thms);
      try{await storageSave(cacheCtxKey,{context:ctx,themes:thms});}catch(e){}
    }catch(e2){}
    setVLoading(false);
  }


  // ── 설교 생성 ──
  async function genSermon(){
    if(!verseReady)return;
    setSLoading(true);setSermonOut("");
    var userMsg="성경 구절: "+refLabel+"\n한국어 개역개정:\n"+korLines.join("\n")+(engText?("\n\n영어 KJV:\n\""+engText+"\""): "")+"\n배경: "+korCtx+"\n\n위 말씀을 바탕으로 "+lv.label+"("+lv.age+") 맞춤 설교를 작성해주세요.";
    try{var out=await callClaude(makeSystemPrompt(level,activeLibObj?activeLibObj.analysis:null),userMsg,4096);setSermonOut(out);}
    catch(e){setSermonOut("❌ 설교 생성 오류: "+e.message);}
    setSLoading(false);
  }

  // ── 키아즘 기반 설교 결과 ──
  const [chiasmSermonOut,     setChiasmSermonOut]     = useState("");
  const [chiasmSermonLoading, setChiasmSermonLoading] = useState(false);
  const [chiasmSermonLevel,   setChiasmSermonLevel]   = useState("adult");

  // ── 키아즘 설교 생성 ──
  async function genSermonFromChiasm(){
    if(!chiasmAnalysis||!verseReady)return;
    setChiasmSermonLoading(true);setChiasmSermonOut("");
    var clv = LEVELS[chiasmSermonLevel];
    var systemPrompt = makeSystemPrompt(chiasmSermonLevel, activeLibObj?activeLibObj.analysis:null);
    var userMsg = "성경 구절: "+refLabel+"\n한국어 개역개정:\n"+korLines.join("\n")+"\n\n"
      +"[키아즘 분석 결과]\n"
      +"제목: "+(chiasmTitle||refLabel+" 키아즘")+"\n"
      +"프레임: "+chiasmFrame+"단 구조\n"
      +"중심절: "+chiasmCenter+"\n\n"
      +"키아즘 분석:\n"+chiasmAnalysis+"\n\n"
      +"위 키아즘 분석의 설교 포인트와 신학적 의미를 반드시 반영하여 "+clv.label+"("+clv.age+") 맞춤 설교를 작성해주세요.";
    try{var out=await callClaude(systemPrompt,userMsg,4096);setChiasmSermonOut(out);}
    catch(e){setChiasmSermonOut("❌ 설교 생성 오류: "+e.message);}
    setChiasmSermonLoading(false);
  }

  // ── 키아즘 분석 생성 ──
  async function genChiasmAnalysis(){
    if(!verseReady||!chiasmCenter.trim())return;
    setChiasmLoading(true);setChiasmAnalysis("");

    // 구조 텍스트 만들기
    var structureText = chiasmLabels.map(function(label,i){
      return label+": "+(chiasmStructure[i]||"(미입력)");
    }).join("\n");

    var systemPrompt = `당신은 성경 키아즘(교차대구법) 전문 분석가입니다. 주어진 성경 본문과 키아즘 구조를 바탕으로 깊이 있는 분석을 제공하세요.
반드시 아래 형식으로 답변하세요:

## 1. 문맥
(본문의 역사적·문학적 문맥 설명 4~5줄)

## 2. 중심절 의미
(키아즘의 중심절이 전달하는 핵심 메시지와 신학적 의미 4~5줄)

## 3. 원어 노트
(핵심 단어들의 히브리어/헬라어 원어 의미와 뉘앙스 4~5줄)

## 4. 문학적 의미
(키아즘 구조가 문학적으로 어떤 효과를 내는지 3~4줄)

## 5. 신학적 의미
(이 키아즘 구조가 전달하는 신학적 메시지 4~5줄)

## 6. 최종 정리
(키아즘 전체 구조의 통합적 의미 정리 4~5줄)

## 7. 설교 포인트
(이 키아즘 분석을 바탕으로 설교할 수 있는 핵심 포인트 3가지)`;

    var userMsg = `성경 구절: ${refLabel}
제목: ${chiasmTitle||"(미입력)"}
키아즘 프레임: ${chiasmFrame}단 구조
중심절: ${chiasmCenter}

키아즘 분석 구조:
${structureText}

본문 말씀:
${korLines.join("\n")}

위 키아즘 구조를 바탕으로 깊이 있는 분석을 제공해주세요.`;

    try{var out=await callClaude(systemPrompt,userMsg,4096);setChiasmAnalysis(out);}
    catch(e){setChiasmAnalysis("❌ 키아즘 분석 오류: "+e.message);}
    setChiasmLoading(false);
  }

  // ── 키아즘 저장 모달 상태 ──
  const [showChiasmSaveModal, setShowChiasmSaveModal] = useState(false);
  const [chiasmSaveType,      setChiasmSaveType]      = useState("chiasm");
  const [chiasmSaveTitle,     setChiasmSaveTitle]     = useState("");
  const [chiasmSaveMsg,       setChiasmSaveMsg]       = useState("");

  function openChiasmSaveModal(type) {
    setChiasmSaveType(type);
    setChiasmSaveTitle(type==="chiasm"?(chiasmTitle||(refLabel+" 키아즘 연구")):((chiasmTitle||refLabel)+" "+LEVELS[chiasmSermonLevel].label+" 설교 (키아즘)"));
    setChiasmSaveMsg(""); setShowChiasmSaveModal(true);
  }

  function resetAll() {
    setBook(""); setFromChap(""); setFromVerse(""); setToChap(""); setToVerse("");
    setKorLines([]); setEngText(""); setKorCtx(""); setThemes([]);
    setSermonOut(""); setVError(""); setLoaded(0); setTotal(0);
    setChiasmTitle(""); setChiasmFrame("7"); setChiasmCenter("");
    setChiasmStructure({}); setChiasmAnalysis(""); setChiasmMemo("");
    setChiasmSermonOut(""); setChiasmSermonLevel("adult");
    setShowExport(false); setShowChiasmExport(false);
  }

  async function autoBackup(sermons, chiasms, lib) {
    var json=JSON.stringify({version:"2.0",exportDate:new Date().toLocaleDateString("ko-KR"),sermons:sermons,chiasms:chiasms,library:lib},null,2);
    if(_dirHandle){var ok=await saveToFolder(json);if(ok){setFolderStatus("saved");setTimeout(function(){setFolderStatus("");},2500);return;}}
    downloadAsFile("설교비서_자동백업.json",json);
  }

  async function saveChiasmAll() {
    if(!chiasmSaveTitle.trim()){setChiasmSaveMsg("제목을 입력해주세요.");return;}
    setChiasmSaveMsg(""); setSaveStatus("saving");
    if(chiasmSaveType==="chiasm"){
      // 키아즘만 저장 - 화면 유지
      var entry={id:Date.now(),title:chiasmSaveTitle.trim(),refLabel:refLabel,frame:chiasmFrame,center:chiasmCenter,structure:chiasmStructure,labels:chiasmLabels,analysis:chiasmAnalysis,memo:chiasmMemo,date:new Date().toLocaleDateString("ko-KR"),time:new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})};
      var updC=[entry].concat(savedChiasms); setSavedChiasms(updC);
      await storageSave("chiasms-v1",updC); await autoBackup(savedSermons,updC,library);
      setSaveStatus("saved"); setTimeout(function(){setSaveStatus("");},3000);
      setShowChiasmSaveModal(false); setChiasmSaveTitle(""); setChiasmSaveMsg("");
      // 화면 유지 - 초기화 안 함
    } else {
      // 키아즘 설교 저장 시 - 키아즘도 함께 저장
      var now = Date.now();
      // 키아즘 저장
      var chiasmEntry={id:now,title:(chiasmTitle||(refLabel+" 키아즘 연구")),refLabel:refLabel,frame:chiasmFrame,center:chiasmCenter,structure:chiasmStructure,labels:chiasmLabels,analysis:chiasmAnalysis,memo:chiasmMemo,date:new Date().toLocaleDateString("ko-KR"),time:new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})};
      var updC2=[chiasmEntry].concat(savedChiasms); setSavedChiasms(updC2);
      await storageSave("chiasms-v1",updC2);
      // 설교 저장
      var lv2=chiasmSermonLevel;
      var sermonEntry={id:now+1,title:chiasmSaveTitle.trim(),refLabel:refLabel,level:lv2,levelLabel:LEVELS[lv2].label,levelEmoji:LEVELS[lv2].emoji,content:chiasmSermonOut,korLines:korLines,themes:themes,styleName:activeLibObj?activeLibObj.name:null,date:new Date().toLocaleDateString("ko-KR"),time:new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})};
      var updS=[sermonEntry].concat(savedSermons); setSavedSermons(updS);
      await storageSave(STORAGE_SERMONS,updS);
      await autoBackup(updS,updC2,library);
      setSaveStatus("saved"); setTimeout(function(){setSaveStatus("");},3000);
      setShowChiasmSaveModal(false); setChiasmSaveTitle(""); setChiasmSaveMsg("");
      resetAll(); setMainTab("bible");
    }
  }

  async function deleteChiasm(id){
    var updated=savedChiasms.filter(function(c){return c.id!==id;});
    setSavedChiasms(updated); await storageSave("chiasms-v1",updated);
    if(viewChiasm&&viewChiasm.id===id)setViewChiasm(null);
    setChiasmDeleteConfirm(null);
  }

  const [showExport, setShowExport] = useState(false);
  const [showChiasmExport, setShowChiasmExport] = useState(false);
  const [showBackup,   setShowBackup]   = useState(false);
  const [importJson,   setImportJson]   = useState("");
  const [importMsg,    setImportMsg]    = useState("");
  const [importStatus, setImportStatus] = useState("");

  async function handlePickFolder() {
    if(!FS_API_SUPPORTED){setFolderStatus("noapi");return;}
    var handle=await pickSaveFolder();
    if(handle){
      setFolderName(handle.name); setFolderStatus("saved"); setShowFolderBanner(false);
      var json=JSON.stringify({version:"2.0",exportDate:new Date().toLocaleDateString("ko-KR"),sermons:savedSermons,chiasms:savedChiasms,library:library},null,2);
      await saveToFolder(json); setTimeout(function(){setFolderStatus("");},3000);
    }
  }

  async function downloadBackup() {
    var json=JSON.stringify({version:"2.0",exportDate:new Date().toLocaleDateString("ko-KR"),sermons:savedSermons,chiasms:savedChiasms,library:library},null,2);
    if(_dirHandle){var ok=await saveToFolder(json);if(ok){setImportMsg("✅ ["+folderName+"] 폴더에 저장되었습니다!");setImportStatus("ok");return;}}
    var date=new Date().toLocaleDateString("ko-KR").replace(/\./g,"-").replace(/ /g,"");
    downloadAsFile("설교비서_백업_"+date+".json",json);
    setImportMsg("✅ 파일이 다운로드되었습니다!"); setImportStatus("ok");
  }

  var importFileRef = useRef();
  function handleImportFile(e) {
    var file=e.target.files&&e.target.files[0]; if(!file)return;
    var reader=new FileReader();
    reader.onload=async function(ev){
      setImportMsg(""); setImportStatus("");
      try {
        var data=JSON.parse(ev.target.result);
        if(data.sermons&&Array.isArray(data.sermons)){var m=data.sermons.concat(savedSermons.filter(function(x){return !data.sermons.find(function(d){return d.id===x.id;});}));setSavedSermons(m);await storageSave(STORAGE_SERMONS,m);}
        if(data.chiasms&&Array.isArray(data.chiasms)){var mc=data.chiasms.concat(savedChiasms.filter(function(x){return !data.chiasms.find(function(d){return d.id===x.id;});}));setSavedChiasms(mc);await storageSave("chiasms-v1",mc);}
        if(data.library&&Array.isArray(data.library)){var ml=data.library.concat(library.filter(function(x){return !data.library.find(function(d){return d.id===x.id;});}));setLibrary(ml);await storageSave(STORAGE_LIBRARY,ml);}
        setImportMsg("✅ 복원 완료! 설교 "+((data.sermons||[]).length)+"편, 키아즘 "+((data.chiasms||[]).length)+"개."); setImportStatus("ok");
      } catch(err){setImportMsg("❌ 오류: 올바른 백업 파일이 아닙니다.");setImportStatus("error");}
      e.target.value="";
    };
    reader.readAsText(file,"UTF-8");
  }

  async function importFromJson() {
    setImportMsg(""); setImportStatus("");
    if(!importJson.trim()){setImportMsg("JSON 데이터를 붙여넣어 주세요.");setImportStatus("error");return;}
    try {
      var data=JSON.parse(importJson.trim());
      if(data.sermons&&Array.isArray(data.sermons)){var m=data.sermons.concat(savedSermons.filter(function(x){return !data.sermons.find(function(d){return d.id===x.id;});}));setSavedSermons(m);await storageSave(STORAGE_SERMONS,m);}
      if(data.chiasms&&Array.isArray(data.chiasms)){var mc=data.chiasms.concat(savedChiasms.filter(function(x){return !data.chiasms.find(function(d){return d.id===x.id;});}));setSavedChiasms(mc);await storageSave("chiasms-v1",mc);}
      if(data.library&&Array.isArray(data.library)){var ml=data.library.concat(library.filter(function(x){return !data.library.find(function(d){return d.id===x.id;});}));setLibrary(ml);await storageSave(STORAGE_LIBRARY,ml);}
      setImportMsg("✅ 완료!"); setImportStatus("ok"); setImportJson("");
    } catch(e){setImportMsg("❌ 오류: 올바른 JSON 형식이 아닙니다.");setImportStatus("error");}
  }

  function openSaveModal(){if(!sermonOut)return;setSaveTitle(refLabel+" "+LEVELS[level].label+" 설교");setShowSaveModal(true);setSaveMsg("");}
  async function saveSermon(){
    if(!saveTitle.trim()){setSaveMsg("제목을 입력해주세요.");return;}
    setSaveMsg("");setSaveStatus("saving");
    var entry={id:Date.now(),title:saveTitle.trim(),refLabel:refLabel,level:level,levelLabel:LEVELS[level].label,levelEmoji:LEVELS[level].emoji,content:sermonOut,korLines:korLines,themes:themes,styleName:activeLibObj?activeLibObj.name:null,date:new Date().toLocaleDateString("ko-KR"),time:new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})};
    var updated=[entry].concat(savedSermons);setSavedSermons(updated);
    try{await storageSave(STORAGE_SERMONS,updated);setSaveStatus("saved");await autoBackup(updated,savedChiasms,library);setTimeout(function(){setSaveStatus("");},3000);}catch(e){setSaveStatus("error");}
    setShowSaveModal(false);setSaveTitle("");setSaveMsg("");setMainTab("saved");
  }
  async function deleteSermon(id){
    var updated=savedSermons.filter(function(x){return x.id!==id;});setSavedSermons(updated);await storageSave(STORAGE_SERMONS,updated);
    if(viewSermon&&viewSermon.id===id)setViewSermon(null);setDeleteConfirm(null);
  }

  // ── 라이브러리 ──
  async function handleUpload(){
    if(!upName.trim()){setUpError("이름을 입력해주세요.");return;}
    if(upFiles.length===0){setUpError("파일을 선택해주세요.");return;}
    setUpLoading(true);setUpError("");setUpProgress("");
    var combinedText="";
    for(var i=0;i<upFiles.length;i++){
      var file=upFiles[i];setUpProgress("파일 읽는 중... ("+(i+1)+"/"+upFiles.length+") "+file.name);
      try{var text=await extractText(file);combinedText+="\n\n=== "+file.name+" ===\n"+text;}
      catch(e){setUpError(file.name+": "+e.message);setUpLoading(false);return;}
    }
    setUpProgress("설교 스타일 분석 중... (약 10~20초)");
    try{
      var prompt="아래 설교 원고를 분석하여 이 목사님의 고유한 설교 스타일을 파악해주세요.\n반드시 순수 JSON만 출력하세요:\n{\"preachingStyle\":\"설교 전달 방식 2~3줄\",\"toneAndVoice\":\"언어 톤과 어조 1~2줄\",\"structurePattern\":\"구조 패턴 1~2줄\",\"theologicalEmphasis\":\"신학적 강조점 2~3줄\",\"keyPhrases\":\"자주 쓰는 표현 3~5가지 (쉼표 구분)\",\"applicationStyle\":\"삶 적용 방식 1~2줄\",\"summary\":\"전체 요약 2~3줄\"}\n\n설교 원고:\n"+combinedText.slice(0,4000);
      var raw=await callClaude("너는 설교 스타일 분석 전문가야. 반드시 순수 JSON만 출력해.",prompt,800);
      var analysis=JSON.parse(raw.replace(/```json|```/g,"").trim());
      var entry={id:Date.now(),name:upName.trim(),analysis:analysis,date:new Date().toLocaleDateString("ko-KR"),fileCount:upFiles.length,bookCat:upBookCat,topics:upTopics.slice(),text:combinedText.slice(0,8000)};
      var updated=library.concat([entry]);setLibrary(updated);await storageSave(STORAGE_LIBRARY,updated);
      setActiveLib(entry.id);setUpName("");setUpFiles([]);setUpProgress("");setUpBookCat("");setUpTopics([]);
      if(fileRef.current)fileRef.current.value="";setMainTab("library");setLibSubTab("sermons");
    }catch(e){setUpError("분석 오류: "+e.message);}
    setUpLoading(false);
  }
  async function deleteLib(id){
    var updated=library.filter(function(l){return l.id!==id;});setLibrary(updated);await storageSave(STORAGE_LIBRARY,updated);
    if(activeLib===id)setActiveLib(null);
  }


  return(
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:"#F1F5F9",fontFamily:"'Noto Sans KR',sans-serif"}}>

      <div style={{background:"linear-gradient(135deg,#1E3A8A,#1D4ED8)",padding:"0 24px",display:"flex",alignItems:"center",gap:16,height:56,flexShrink:0,boxShadow:"0 2px 12px rgba(0,0,0,.25)"}}>
        <span style={{fontSize:22,color:"#93C5FD",fontFamily:"serif"}}>✝</span>
        <span style={{fontSize:18,fontWeight:700,color:"#F0F9FF",fontFamily:"'Noto Serif KR',serif"}}>설교 비서</span>
        <span style={{fontSize:11,color:"rgba(255,255,255,.5)",marginLeft:4}}>Claude AI</span>
        <div style={{flex:1}}/>
        {saveStatus==="saving"&&<span style={{fontSize:11,color:"#93C5FD"}}>{"💾 저장 중..."}</span>}
        {saveStatus==="saved"&&<span style={{fontSize:11,color:"#86EFAC"}}>{"✅ 저장 완료!"}</span>}
        {folderStatus==="saved"&&<span style={{fontSize:11,color:"#86EFAC"}}>{"📁 "+folderName+" 저장됨"}</span>}
        {showFolderBanner&&!_dirHandle&&(
          <button style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid rgba(255,255,255,.4)",background:"transparent",color:"#fff",fontSize:11,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={handlePickFolder}>{"📁 저장 폴더 선택"}</button>
        )}
        {showFolderBanner&&_dirHandle&&(
          <button style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid #86EFAC",background:"transparent",color:"#86EFAC",fontSize:11,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={handlePickFolder}>{"📁 "+folderName+" 연결됨"}</button>
        )}
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        <div style={{width:220,flexShrink:0,background:"#1E293B",display:"flex",flexDirection:"column",padding:"16px 12px",gap:4,overflowY:"auto"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#475569",letterSpacing:2,padding:"0 8px",marginBottom:6}}>메뉴</div>
          {[
            {key:"bible",  emoji:"📖", label:"성경 검색",        sub:"본문 선택 및 불러오기", color:"#2563EB", always:true},
            {key:"chiasm", emoji:"🔁", label:"키아즘 연구",      sub:"교차대구법 분석",       color:"#7C3AED", always:false},
            {key:"sermon", emoji:"✝",  label:"설교 생성",        sub:"연령대별 설교 생성",    color:"#059669", always:false},
            {key:"library",emoji:"📚", label:"스타일 라이브러리",sub:"설교 파일 등록·분석",   color:"#B45309", always:true},
          ].map(function(item){
            var active=mainTab===item.key;
            var enabled=item.always||verseReady;
            return(
              <button key={item.key} onClick={function(){if(enabled)setMainTab(item.key);}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:10,border:"none",
                  background:active?"rgba(255,255,255,.15)":"transparent",
                  color:active?"#fff":enabled?"#94A3B8":"#3E4C5E",
                  textAlign:"left",cursor:enabled?"pointer":"not-allowed",
                  fontFamily:"'Noto Sans KR',sans-serif",fontSize:13,fontWeight:active?700:400,marginBottom:2,
                  borderLeft:active?"3px solid "+item.color:"3px solid transparent"}}>
                <span style={{fontSize:16,opacity:enabled?1:.35}}>{item.emoji}</span>
                <div>
                  <div style={{opacity:enabled?1:.4}}>{item.label}</div>
                  <div style={{fontSize:10,opacity:.5,marginTop:1}}>{enabled?item.sub:"성경 검색 후 활성화"}</div>
                </div>
              </button>
            );
          })}
          <div style={{height:1,background:"#334155",margin:"8px 0"}}/>
          <button onClick={function(){setMainTab("saved");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:10,border:"none",
              background:mainTab==="saved"?"rgba(255,255,255,.15)":"transparent",
              color:mainTab==="saved"?"#fff":"#94A3B8",textAlign:"left",cursor:"pointer",
              fontFamily:"'Noto Sans KR',sans-serif",fontSize:13,fontWeight:mainTab==="saved"?700:400,
              borderLeft:mainTab==="saved"?"3px solid #0F766E":"3px solid transparent"}}>
            <span style={{fontSize:16}}>💾</span>
            <div>
              <div>{"저장된 설교"}</div>
              <div style={{fontSize:10,opacity:.6,marginTop:1}}>{savedSermons.length}{"편 · 키아즘 "}{savedChiasms.length}{"개"}</div>
            </div>
          </button>
          <div style={{flex:1}}/>
          {verseReady&&(
            <div style={{padding:"10px 12px",background:"rgba(255,255,255,.06)",borderRadius:10,border:"1px solid #334155",marginTop:8}}>
              <div style={{fontSize:10,color:"#64748B",marginBottom:3}}>{"현재 본문"}</div>
              <div style={{fontSize:12,color:"#CBD5E1",fontWeight:600,lineHeight:1.4}}>{refLabel}</div>
              <div style={{fontSize:10,color:"#64748B",marginTop:2}}>{korLines.length}{"절"}</div>
            </div>
          )}
          {activeLibObj&&(
            <div style={{padding:"10px 12px",background:"rgba(37,99,235,.15)",borderRadius:10,border:"1px solid #2563EB",marginTop:6}}>
              <div style={{fontSize:10,color:"#93C5FD",marginBottom:3}}>{"적용 스타일"}</div>
              <div style={{fontSize:12,color:"#BFDBFE",fontWeight:600}}>{activeLibObj.name}</div>
              <button style={{fontSize:10,color:"#64748B",background:"none",border:"none",cursor:"pointer",padding:0,marginTop:2,fontFamily:"'Noto Sans KR',sans-serif"}} onClick={function(){setActiveLib(null);}}>{"✕ 해제"}</button>
            </div>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px 24px",minWidth:0}}>

          {mainTab==="bible"&&(
            <div>
              <div style={sy.pageTitle}>{"📖 성경 검색"}</div>
              <div style={sy.card}>
                <div style={sy.cardTitle}>{"📚 성경 책 선택"} <span style={sy.dim}>{"(신구약 66권)"}</span></div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {Object.keys(BIBLE_BOOKS).map(function(t){var books=BIBLE_BOOKS[t];return(
                    <div key={t} style={{flex:1,minWidth:180}}>
                      <div style={sy.selLabel}>{t}{" · "}{books.length}{"권"}</div>
                      <select style={sy.sel} value={books.find(function(b){return b.name===book;})?book:""} onChange={function(e){if(e.target.value)setBook(e.target.value);}}>
                        <option value="">{t}{" 선택..."}</option>
                        {books.map(function(b){return <option key={b.name} value={b.name}>{b.name}</option>;})}
                      </select>
                    </div>
                  );})}
                </div>
                {book&&<div style={sy.infoTag}>{"📖 "}<b>{book}</b>{" — 총 "}{maxChap}{"장"}</div>}
              </div>
              {book&&(
                <div style={sy.card}>
                  <div style={sy.cardTitle}>{"🔢 본문 범위 선택"}</div>
                  <div style={sy.rangeWrap}>
                    <div style={sy.rangeGroup}>
                      <div style={sy.rangeLabel}>{"📍 시작"}</div>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{flex:1}}><div style={sy.selLabel}>{"장"}</div>
                          <select style={sy.sel} value={fromChap} onChange={function(e){setFromChap(e.target.value);}}>
                            <option value="">{"장"}</option>
                            {Array.from({length:maxChap},function(_,i){return i+1;}).map(function(n){return <option key={n} value={n}>{n}{"장"}</option>;})}
                          </select>
                        </div>
                        <div style={{flex:1}}><div style={sy.selLabel}>{"절 ("}{fromChap?fromVerseMax:"?"}{"절)"}</div>
                          <select style={sy.sel} value={fromVerse} onChange={function(e){setFromVerse(e.target.value);}} disabled={!fromChap}>
                            <option value="">{"절"}</option>
                            {Array.from({length:fromVerseMax},function(_,i){return i+1;}).map(function(n){return <option key={n} value={n}>{n}{"절"}</option>;})}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div style={sy.arrow}>{"→"}</div>
                    <div style={sy.rangeGroup}>
                      <div style={sy.rangeLabel}>{"🏁 끝"}</div>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{flex:1}}><div style={sy.selLabel}>{"장"}</div>
                          <select style={sy.sel} value={toChap} onChange={function(e){setToChap(e.target.value);}} disabled={!fromVerse}>
                            <option value="">{"장"}</option>
                            {toChapOpts.map(function(n){return <option key={n} value={n}>{n}{"장"}</option>;})}
                          </select>
                        </div>
                        <div style={{flex:1}}><div style={sy.selLabel}>{"절 ("}{toChap?toVerseMax:"?"}{"절)"}</div>
                          <select style={sy.sel} value={toVerse} onChange={function(e){setToVerse(e.target.value);}} disabled={!toChap}>
                            <option value="">{"절"}</option>
                            {toVerseOpts.map(function(n){return <option key={n} value={n}>{n}{"절"}</option>;})}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(book&&fromChap&&fromVerse&&toChap&&toVerse)&&<div style={sy.infoTag}>{"📌 "}<b>{refLabel}</b>{total>1&&<span style={{color:"#6B7280",fontWeight:400}}>{" · 총 "}{total}{"절"}</span>}</div>}
                  {!fromChap&&<div style={sy.hint}>{"💡 시작 장을 먼저 선택하세요."}</div>}
                  {fromChap&&!fromVerse&&<div style={sy.hint}>{"💡 시작 절을 선택하세요."}</div>}
                  {fromVerse&&!toChap&&<div style={sy.hint}>{"💡 끝 장을 선택하세요."}</div>}
                  {toChap&&!toVerse&&<div style={sy.hint}>{"💡 끝 절을 선택하면 말씀이 자동으로 불러와집니다."}</div>}
                </div>
              )}
              {(vLoading||korLines.length>0||vError)&&(
                <div style={sy.verseCard}>
                  <div style={sy.verseHead}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <span style={sy.verseRef}>{refLabel||"말씀 불러오는 중..."}</span>
                      {!vLoading&&engText&&<span style={sy.kjvBadge}>{"KJV ✓"}</span>}
                      {vLoading&&<span style={{color:"rgba(255,255,255,.7)",fontSize:12}}>{"("}{loaded}{"/"}{total}{"절)"}</span>}
                    </div>
                    {!vLoading&&korLines.length>0&&(
                      <div style={{display:"flex",gap:6}}>
                        {[["both","한·영"],["kor","한국어"],["eng","English"]].map(function(it){return(
                          <button key={it[0]} style={Object.assign({},sy.langBtn,showLang===it[0]?sy.langBtnOn:{})} onClick={function(){setShowLang(it[0]);}}>{it[1]}</button>
                        );})}
                      </div>
                    )}
                  </div>
                  <div style={{padding:"18px 20px 16px"}}>
                    {vLoading&&(
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                          <div style={sy.spin}/>
                          <div>
                            <p style={{fontSize:14,fontWeight:600,color:"#374151"}}>{"말씀 불러오는 중... ("}{loaded}{"/"}{total}{"절)"}</p>
                            <div style={{marginTop:6,width:200,height:5,background:"#E5E7EB",borderRadius:9}}>
                              <div style={{height:5,borderRadius:9,background:"linear-gradient(90deg,#3B82F6,#6366F1)",width:(total>0?(loaded/total*100):0)+"%",transition:"width .3s"}}/>
                            </div>
                          </div>
                        </div>
                        {korLines.map(function(l,i){return <p key={i} style={{fontSize:13,color:"#9CA3AF",lineHeight:1.8}}>{l}</p>;})}
                      </div>
                    )}
                    {vError&&<p style={{color:"#DC2626",fontSize:13}}>{"⚠️ "}{vError}</p>}
                    {!vLoading&&korLines.length>0&&(
                      <div>
                        {(showLang==="both"||showLang==="kor")&&(
                          <div>
                            <span style={sy.badgeKor}>{"🇰🇷 개역개정"}</span>
                            <div style={{marginTop:6}}>{korLines.map(function(l,i){return <p key={i} style={{fontSize:15,color:"#111827",lineHeight:2,fontFamily:"'Noto Serif KR',serif",fontWeight:500,marginBottom:2}}>{l}</p>;})}</div>
                            {korCtx&&<p style={{fontSize:13,color:"#6B7280",marginTop:8}}>{"📌 "}{korCtx}</p>}
                            {themes.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>{themes.map(function(t,i){return <span key={i} style={sy.themeBadge}>{t}</span>;})}</div>}
                          </div>
                        )}
                        {showLang==="both"&&engText&&<div style={{height:1,background:"#E5E7EB",margin:"14px 0"}}/>}
                        {(showLang==="both"||showLang==="eng")&&engText&&(
                          <div>
                            <span style={sy.badgeEng}>{"🇺🇸 King James Version"}</span>
                            <div style={{marginTop:6}}>{engText.split("\n").map(function(l,i){return l.trim()?<p key={i} style={{fontSize:14,color:"#374151",lineHeight:1.9,fontFamily:"Georgia,serif"}}>{l}</p>:null;})}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {verseReady&&(
                <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
                  <button style={{flex:1,padding:"13px",background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setMainTab("chiasm");}}>{"🔁 키아즘 연구하기"}</button>
                  <button style={{flex:1,padding:"13px",background:"linear-gradient(135deg,#059669,#047857)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setMainTab("sermon");}}>{"✝ 설교 생성하기"}</button>
                </div>
              )}
            </div>
          )}

          {mainTab==="chiasm"&&(
            <div>
              <div style={sy.pageTitle}>{"🔁 키아즘 연구"}</div>
              {!verseReady&&<div style={sy.hint}>{"💡 먼저 성경 검색에서 본문을 선택해주세요."}</div>}
              {verseReady&&(
                <div>
                  <div style={sy.infoTagGreen}>{"📌 분석 본문: "}<b>{refLabel}</b></div>
                  <div style={sy.card}><div style={sy.cardTitle}>{"📌 키아즘 제목"}</div><input style={sy.nameInput} placeholder="예: 요한복음 3장의 키아즘 구조" value={chiasmTitle} onChange={function(e){setChiasmTitle(e.target.value);}}/></div>
                  <div style={sy.card}>
                    <div style={sy.cardTitle}>{"🔢 키아즘 프레임"}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {CHIASM_FRAMES.map(function(f){var isOn=chiasmFrame===f.value;return(
                        <button key={f.value} style={{padding:"6px 14px",borderRadius:20,border:isOn?"2px solid #7C3AED":"1.5px solid #E5E7EB",background:isOn?"#7C3AED":"#F9FAFB",color:isOn?"#fff":"#374151",fontSize:12,fontWeight:isOn?700:400,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setChiasmFrame(f.value);}}>{f.label}</button>
                      );})}
                    </div>
                  </div>
                  <div style={sy.card}>
                    <div style={sy.cardTitle}>{"📋 분석 구조 입력"}</div>
                    <div style={{background:"#F8F5FF",borderRadius:14,padding:"16px",border:"1.5px solid #DDD6FE"}}>
                      {chiasmLabels.map(function(label,i){var isC=label.indexOf("중심")>-1;return(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <span style={{fontWeight:700,color:isC?"#7C3AED":"#4F46E5",minWidth:70,fontSize:13,flexShrink:0}}>{label}</span>
                          <input style={{flex:1,padding:"8px 12px",borderRadius:8,border:isC?"2px solid #7C3AED":"1.5px solid #E5E7EB",fontSize:13,fontFamily:"'Noto Sans KR',sans-serif",background:isC?"#F5F3FF":"#fff",color:"#111827",outline:"none"}}
                            placeholder={isC?"중심 내용 입력":"내용 입력"} value={chiasmStructure[i]||""}
                            onChange={function(e){var sc=Object.assign({},chiasmStructure);sc[i]=e.target.value;setChiasmStructure(sc);}}/>
                        </div>
                      );})}
                    </div>
                  </div>
                  <div style={sy.card}><div style={sy.cardTitle}>{"⭐ 중심절"}</div><input style={{...sy.nameInput,border:"2px solid #7C3AED"}} placeholder="예: 3절 — 하나님이 세상을 이처럼 사랑하사..." value={chiasmCenter} onChange={function(e){setChiasmCenter(e.target.value);}}/></div>
                  <button style={{width:"100%",padding:"14px",background:chiasmLoading||!chiasmCenter.trim()?"#CBD5E1":"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:chiasmLoading||!chiasmCenter.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:12}}
                    onClick={genChiasmAnalysis} disabled={chiasmLoading||!chiasmCenter.trim()}>
                    {chiasmLoading?<><div style={sy.spinSm}/>{"키아즘 분석 중..."}</>:<>{"🔍 키아즘 분석 실행"}</>}
                  </button>
                  {!chiasmCenter.trim()&&<div style={sy.hint}>{"💡 중심절을 입력해야 분석을 실행할 수 있습니다."}</div>}
                  {(chiasmLoading||chiasmAnalysis)&&(
                    <div style={{...sy.resultCard,borderColor:"#DDD6FE",marginBottom:16}}>
                      <div style={{...sy.resultHead,background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}}>
                        <span style={{fontSize:20}}>{"🔁"}</span>
                        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Noto Serif KR',serif"}}>{chiasmTitle||"키아즘 분석 결과"}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:2}}>{refLabel}{" · "}{chiasmFrame}{"단"}</div></div>
                        {!chiasmLoading&&chiasmAnalysis&&(<button style={sy.saveBtn} onClick={function(){openChiasmSaveModal("chiasm");}}>{"💾 저장"}</button>)}
                      </div>
                      <div style={{...sy.resultBody,background:"#FAF5FF"}}>
                        {chiasmLoading?<div style={sy.loadBox}><div style={sy.spinLg}/><p style={sy.loadTxt}>{"🔍 키아즘 구조를 분석하고 있습니다..."}</p></div>:<div>{renderMd(chiasmAnalysis)}</div>}
                      </div>
                      {!chiasmLoading&&chiasmAnalysis&&(
                        <div style={{borderTop:"2px solid #DDD6FE",background:"#F5F3FF",padding:"18px 22px"}}>
                          <div style={{fontSize:13,fontWeight:700,color:"#7C3AED",marginBottom:8}}>{"✏️ 나의 분석 메모"}</div>
                          <textarea style={{width:"100%",minHeight:300,padding:"12px",borderRadius:10,border:"2px solid #DDD6FE",fontSize:13,fontFamily:"'Noto Sans KR',sans-serif",color:"#374151",background:"#fff",resize:"vertical",lineHeight:1.8,outline:"none"}}
                            placeholder="키아즘 구조에 대한 생각을 자유롭게 기록하세요..." value={chiasmMemo} onChange={function(e){setChiasmMemo(e.target.value);}}/>
                        </div>
                      )}
                    </div>
                  )}
                  {chiasmAnalysis&&!chiasmLoading&&(
                    <div style={sy.card}>
                      <div style={sy.cardTitle}>{"✝ 키아즘 분석 기반 설교 생성"}</div>
                      <div style={sy.selLabel}>{"👥 연령대"}</div>
                      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                        {Object.keys(LEVELS).map(function(key){var cfg=LEVELS[key];var isOn=chiasmSermonLevel===key;return(
                          <button key={key} style={{...sy.lvBtn,...(isOn?{background:cfg.gradient,color:"#fff",border:"2px solid transparent"}:{})}} onClick={function(){setChiasmSermonLevel(key);}}>
                            <span style={{fontSize:22}}>{cfg.emoji}</span><span style={{fontSize:13,fontWeight:700}}>{cfg.label}</span><span style={{fontSize:11,opacity:.7}}>{cfg.age}</span>
                          </button>
                        );})}
                      </div>
                      <button style={{width:"100%",padding:"14px",background:chiasmSermonLoading?"#CBD5E1":"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:chiasmSermonLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                        onClick={genSermonFromChiasm} disabled={chiasmSermonLoading}>
                        {chiasmSermonLoading?<><div style={sy.spinSm}/>{"설교 작성 중..."}</>:<>{"🔁 키아즘으로 "}{LEVELS[chiasmSermonLevel].label}{" 설교 생성"}</>}
                      </button>
                    </div>
                  )}
                  {(chiasmSermonLoading||chiasmSermonOut)&&(function(){var clv=LEVELS[chiasmSermonLevel];return(
                    <div style={{...sy.resultCard,borderColor:clv.border,marginBottom:16}}>
                      <div style={{...sy.resultHead,background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}}>
                        <span style={{fontSize:20}}>{"🔁"}</span>
                        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Noto Serif KR',serif"}}>{"키아즘 기반 "}{clv.label}{" 설교"}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:2}}>{refLabel}</div></div>
                        {!chiasmSermonLoading&&chiasmSermonOut&&(
                          <div style={{display:"flex",gap:6}}>
                            <button style={sy.saveBtn} onClick={function(){openChiasmSaveModal("chiasmSermon");}}>{"💾 저장"}</button>
                            <button style={{...sy.saveBtn,fontSize:11}} onClick={function(){setShowChiasmExport(!showChiasmExport);}}>{"Export"}</button>
                          </div>
                        )}
                      </div>
                      <div style={{...sy.resultBody,background:clv.bg}}>
                        {chiasmSermonLoading?<div style={sy.loadBox}><div style={sy.spinLg}/><p style={sy.loadTxt}>{"✍️ 키아즘 기반 설교 작성 중..."}</p></div>:<div>{renderMd(chiasmSermonOut)}</div>}
                      </div>
                    </div>
                  );})()}
                  {showChiasmExport&&chiasmSermonOut&&(
                    <div style={sy.card}><div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:6}}>{"📋 텍스트 내보내기"}</div>
                      <textarea readOnly style={{width:"100%",height:280,padding:"12px",borderRadius:10,border:"1.5px solid #E5E7EB",fontSize:12,fontFamily:"'Noto Sans KR',sans-serif",color:"#374151",background:"#F9FAFB",resize:"vertical",lineHeight:1.7,outline:"none"}}
                        value={makeExportText((chiasmTitle||refLabel)+" 키아즘 설교",refLabel,korLines,chiasmSermonOut)} onClick={function(e){e.target.select();}}/>
                    </div>
                  )}
                  {savedChiasms.length>0&&(
                    <div style={sy.card}><div style={sy.cardTitle}>{"저장된 키아즘 연구 ("}{savedChiasms.length}{"개)"}</div>
                      {savedChiasms.map(function(c){return(
                        <div key={c.id} style={sy.sermonCard}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
                            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{"🔁"}</div>
                            <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#111827",marginBottom:2}}>{c.title}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{c.refLabel}{" · "}{c.frame}{"단 · "}{c.date}</div></div>
                            <button style={sy.viewBtn} onClick={function(){setViewChiasm(c);}}>{"View"}</button>
                            <button style={sy.delBtnSm} onClick={function(){setChiasmDeleteConfirm(c.id);}}>{"DEL"}</button>
                          </div>
                          {chiasmDeleteConfirm===c.id&&(<div style={sy.confirmBox}><p style={{fontSize:13,color:"#374151",marginBottom:10}}>{"삭제할까요?"}</p><div style={{display:"flex",gap:8}}><button style={sy.modalCancelBtn} onClick={function(){setChiasmDeleteConfirm(null);}}>{"취소"}</button><button style={{...sy.modalSaveBtn,background:"linear-gradient(135deg,#DC2626,#B91C1C)"}} onClick={function(){deleteChiasm(c.id);}}>{"삭제"}</button></div></div>)}
                        </div>
                      );})}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {mainTab==="sermon"&&(
            <div>
              <div style={sy.pageTitle}>{"✝ 설교 생성"}</div>
              {!verseReady&&<div style={sy.hint}>{"💡 먼저 성경 검색에서 본문을 선택해주세요."}</div>}
              {verseReady&&(
                <div>
                  <div style={sy.infoTagGreen}>{"📌 본문: "}<b>{refLabel}</b></div>
                  {activeLibObj&&<div style={{...sy.infoTagGreen,borderColor:"#BFDBFE",background:"#EFF6FF",color:"#1D4ED8",marginTop:6}}>{"🎨 "}{activeLibObj.name}{" 스타일 적용 중"}</div>}
                  <div style={sy.card}>
                    <div style={sy.cardTitle}>{"👥 연령대 선택"}</div>
                    <div style={{display:"flex",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                      {Object.keys(LEVELS).map(function(key){var cfg=LEVELS[key];var isOn=level===key;return(
                        <button key={key} style={{...sy.lvBtn,...(isOn?{background:cfg.gradient,color:"#fff",border:"2px solid transparent",transform:"translateY(-2px)"}:{})}} onClick={function(){setLevel(key);}}>
                          <span style={{fontSize:24}}>{cfg.emoji}</span><span style={{fontSize:13,fontWeight:700}}>{cfg.label}</span><span style={{fontSize:11,opacity:.7}}>{cfg.age}</span>
                        </button>
                      );})}
                    </div>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:12,border:"1.5px solid "+lv.color+"33",background:lv.bg,marginBottom:14}}>
                      <span style={{fontSize:18}}>{lv.emoji}</span>
                      <div><div style={{fontSize:13,fontWeight:700,color:lv.color}}>{lv.label}{" ("}{lv.age}{")"}</div><div style={{fontSize:12,color:"#6B7280",marginTop:2}}>{level==="children"?"쉬운 비유·활동 중심":level==="youth"?"공감 스토리·도전 중심":"신학적 깊이·원어 분석"}</div></div>
                    </div>
                    <button style={{width:"100%",padding:"14px",background:sLoading?"#CBD5E1":lv.gradient,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:sLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                      onClick={genSermon} disabled={sLoading}>
                      {sLoading?<><div style={sy.spinSm}/>{"설교 작성 중..."}</>:<>{lv.emoji}{" "}{lv.label}{" 설교 생성하기"}</>}
                    </button>
                  </div>
                  {(sLoading||sermonOut)&&(
                    <div style={{...sy.resultCard,borderColor:lv.border,marginBottom:16}}>
                      <div style={{...sy.resultHead,background:lv.gradient}}>
                        <span style={{fontSize:20}}>{lv.emoji}</span>
                        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Noto Serif KR',serif"}}>{lv.label}{" 설교 자료"}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:1}}>{refLabel}</div></div>
                        {!sLoading&&sermonOut&&(
                          <div style={{display:"flex",gap:6}}>
                            <button style={sy.saveBtn} onClick={openSaveModal}>{"💾 저장"}</button>
                            <button style={{...sy.saveBtn,fontSize:11}} onClick={function(){setShowExport(!showExport);}}>{"Export"}</button>
                          </div>
                        )}
                      </div>
                      <div style={{...sy.resultBody,background:lv.bg}}>
                        {sLoading?<div style={sy.loadBox}><div style={sy.spinLg}/><p style={sy.loadTxt}>{"✍️ "}{lv.label}{" 맞춤 설교를 작성하고 있습니다..."}</p></div>:<div>{renderMd(sermonOut)}</div>}
                      </div>
                    </div>
                  )}
                  {showExport&&sermonOut&&(
                    <div style={sy.card}><div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:6}}>{"📋 텍스트 내보내기"}</div>
                      <textarea readOnly style={{width:"100%",height:280,padding:"12px",borderRadius:10,border:"1.5px solid #E5E7EB",fontSize:12,fontFamily:"'Noto Sans KR',sans-serif",color:"#374151",background:"#F9FAFB",resize:"vertical",lineHeight:1.7,outline:"none"}}
                        value={makeExportText(refLabel+" "+lv.label+" 설교",refLabel,korLines,sermonOut)} onClick={function(e){e.target.select();}}/>
                    </div>
                  )}
                  {sermonOut&&!sLoading&&(
                    <button style={{width:"100%",marginTop:4,padding:"13px",background:lv.gradient,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={openSaveModal}>{"💾 설교 저장하기"}</button>
                  )}
                </div>
              )}
            </div>
          )}

          {mainTab==="library"&&(
            <div>
              <div style={sy.pageTitle}>{"📚 스타일 라이브러리"}</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {[["upload","📤 설교 등록"],["sermons","📖 원문 열람"],["styles","🎨 스타일 분석"]].map(function(item){return(
                  <button key={item[0]} style={{flex:1,padding:"9px 6px",borderRadius:12,border:libSubTab===item[0]?"2px solid #B45309":"1.5px solid #E5E7EB",background:libSubTab===item[0]?"#92400E":"#F9FAFB",color:libSubTab===item[0]?"#fff":"#374151",fontSize:12,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setLibSubTab(item[0]);}}>{item[1]}</button>
                );})}
              </div>
              {libSubTab==="upload"&&(
                <div style={sy.card}>
                  <div style={sy.cardTitle}>{"📤 나의 설교 파일 등록"}</div>
                  <p style={{fontSize:13,color:"#6B7280",marginBottom:14,lineHeight:1.7}}>{"설교 원고를 업로드하면 원문이 저장되고 AI가 스타일을 분석합니다. "}<b>{"(pdf · docx · txt)"}</b></p>
                  <div style={{marginBottom:12}}><div style={sy.selLabel}>{"📛 설교 제목"}</div><input style={sy.nameInput} placeholder="예: 2024년 부활절 설교" value={upName} onChange={function(e){setUpName(e.target.value);}}/></div>
                  <div style={{marginBottom:12}}><div style={sy.selLabel}>{"📖 성경책 카테고리"}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {Object.keys(BIBLE_BOOKS).map(function(t){return(
                        <div key={t} style={{flex:1,minWidth:150}}><div style={{fontSize:11,color:"#9CA3AF",marginBottom:4}}>{t}</div>
                          <select style={sy.sel} value={upBookCat} onChange={function(e){setUpBookCat(e.target.value);}}>
                            <option value="">{"성경책 선택..."}</option>
                            {BIBLE_BOOKS[t].map(function(b){return <option key={b.name} value={b.name}>{b.name}</option>;})}
                          </select>
                        </div>
                      );})}
                    </div>
                  </div>
                  <div style={{marginBottom:14}}><div style={sy.selLabel}>{"🏷️ 주제 카테고리"}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {SERMON_TOPICS.map(function(topic){var isOn=upTopics.indexOf(topic.value)>-1;return(
                        <button key={topic.value} style={{padding:"5px 12px",borderRadius:20,border:isOn?"2px solid "+topic.color:"1.5px solid #E5E7EB",background:isOn?topic.color:"#F9FAFB",color:isOn?"#fff":"#374151",fontSize:12,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}}
                          onClick={function(){if(isOn)setUpTopics(upTopics.filter(function(t){return t!==topic.value;}));else setUpTopics(upTopics.concat([topic.value]));}}>{topic.emoji}{" "}{topic.label}</button>
                      );})}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}><div style={sy.selLabel}>{"📁 파일 선택"}</div>
                    <div style={sy.dropArea} onClick={function(){if(fileRef.current)fileRef.current.click();}}>
                      <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" multiple style={{display:"none"}} onChange={function(e){setUpFiles(Array.from(e.target.files));}}/>
                      {upFiles.length===0
                        ?<div style={{textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>{"📂"}</div><p style={{fontSize:14,color:"#6B7280"}}>{"클릭하여 파일 선택"}</p><p style={{fontSize:12,color:"#9CA3AF",marginTop:4}}>{"PDF · DOCX · TXT 지원"}</p></div>
                        :<div style={{width:"100%"}}>{upFiles.map(function(f,i){return <div key={i} style={sy.fileItem}><span style={{fontSize:16}}>{f.name.endsWith(".pdf")?"📄":f.name.endsWith(".docx")?"📝":"📃"}</span><span style={{fontSize:13,color:"#374151",flex:1}}>{f.name}</span><span style={{fontSize:11,color:"#9CA3AF"}}>{(f.size/1024).toFixed(0)}{"KB"}</span></div>;})}
                          <p style={{fontSize:12,color:"#6B7280",marginTop:8,textAlign:"center"}}>{"클릭하여 변경"}</p></div>
                      }
                    </div>
                  </div>
                  {upError&&<p style={{color:"#DC2626",fontSize:13,marginBottom:8}}>{"⚠️ "}{upError}</p>}
                  {upProgress&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#EFF6FF",borderRadius:10,marginBottom:10}}><div style={sy.spinSm2}/><span style={{fontSize:13,color:"#1D4ED8"}}>{upProgress}</span></div>}
                  <button style={{width:"100%",padding:"14px",background:upLoading?"#CBD5E1":"linear-gradient(135deg,#B45309,#92400E)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:upLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={handleUpload} disabled={upLoading}>
                    {upLoading?<><div style={sy.spinSm}/>{"등록 중..."}</>:<>{"🔍 업로드 및 등록"}</>}
                  </button>
                </div>
              )}
              {libSubTab==="sermons"&&(
                <div>
                  <div style={sy.card}>
                    <div style={{fontSize:14,fontWeight:700,color:"#111827",marginBottom:10}}>{"📖 등록된 설교 원문 ("}{library.length}{"편)"}</div>
                    <input style={{...sy.nameInput,marginBottom:10}} placeholder="🔍 제목으로 검색..." value={libSearch} onChange={function(e){setLibSearch(e.target.value);}}/>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                      <button style={{padding:"4px 10px",borderRadius:20,border:libBookFilter===""?"2px solid #1D4ED8":"1.5px solid #E5E7EB",background:libBookFilter===""?"#1D4ED8":"#F9FAFB",color:libBookFilter===""?"#fff":"#374151",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setLibBookFilter("");}}>{"전체"}</button>
                      {Array.from(new Set(library.filter(function(l){return l.bookCat;}).map(function(l){return l.bookCat;}))).map(function(b){return(<button key={b} style={{padding:"4px 10px",borderRadius:20,border:libBookFilter===b?"2px solid #1D4ED8":"1.5px solid #E5E7EB",background:libBookFilter===b?"#1D4ED8":"#F9FAFB",color:libBookFilter===b?"#fff":"#374151",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setLibBookFilter(b);}}>{b}</button>);})}
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <button style={{padding:"4px 10px",borderRadius:20,border:libTopicFilter===""?"2px solid #6B7280":"1.5px solid #E5E7EB",background:libTopicFilter===""?"#6B7280":"#F9FAFB",color:libTopicFilter===""?"#fff":"#374151",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setLibTopicFilter("");}}>{"전체"}</button>
                      {SERMON_TOPICS.map(function(topic){return(<button key={topic.value} style={{padding:"4px 10px",borderRadius:20,border:libTopicFilter===topic.value?"2px solid "+topic.color:"1.5px solid #E5E7EB",background:libTopicFilter===topic.value?topic.color:"#F9FAFB",color:libTopicFilter===topic.value?"#fff":"#374151",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setLibTopicFilter(topic.value);}}>{topic.emoji}{" "}{topic.label}</button>);})}
                    </div>
                  </div>
                  {(function(){
                    var filtered=library.filter(function(l){return(!libSearch||l.name.indexOf(libSearch)>-1)&&(!libBookFilter||l.bookCat===libBookFilter)&&(!libTopicFilter||(l.topics&&l.topics.indexOf(libTopicFilter)>-1));});
                    if(filtered.length===0)return <div style={sy.emptyBox}><p style={{color:"#9CA3AF",fontSize:13}}>{"해당 조건의 설교가 없습니다."}</p></div>;
                    return filtered.map(function(lib){var isOpen=libOpenId===lib.id;return(
                      <div key={lib.id} style={sy.libCard}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
                          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#1D4ED8,#4F46E5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{"📖"}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:14,fontWeight:700,color:"#111827",marginBottom:3}}>{lib.name}</div>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:3}}>
                              {lib.bookCat&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#EFF6FF",color:"#1D4ED8",border:"1px solid #BFDBFE",fontWeight:600}}>{"📖 "}{lib.bookCat}</span>}
                              {lib.topics&&lib.topics.map(function(t){var topic=SERMON_TOPICS.find(function(x){return x.value===t;});if(!topic)return null;return <span key={t} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:topic.color+"22",color:topic.color,border:"1px solid "+topic.color+"44",fontWeight:600}}>{topic.emoji}{" "}{topic.label}</span>;})}
                            </div>
                            <div style={{fontSize:11,color:"#9CA3AF"}}>{lib.date}{" · 파일 "}{lib.fileCount}{"개"}</div>
                          </div>
                          <div style={{display:"flex",gap:6,flexShrink:0}}>
                            {lib.text&&<button style={sy.viewBtn} onClick={function(){setLibOpenId(isOpen?null:lib.id);}}>{isOpen?"접기":"📄 원문"}</button>}
                            <button style={{...sy.useBtn,...(activeLib===lib.id?sy.useBtnOn:{})}} onClick={function(){if(activeLib===lib.id)setActiveLib(null);else{setActiveLib(lib.id);setMainTab("sermon");}}}>{activeLib===lib.id?"✓ 사용 중":"스타일 적용"}</button>
                            <button style={sy.delBtnSm} onClick={function(){deleteLib(lib.id);}}>{"DEL"}</button>
                          </div>
                        </div>
                        {isOpen&&lib.text&&(<div style={{borderTop:"1px solid #E5E7EB",padding:"14px 16px",background:"#F8FAFF"}}><div style={{fontSize:12,fontWeight:700,color:"#6B7280",marginBottom:6}}>{"📄 설교 원문"}</div><div style={{maxHeight:400,overflowY:"auto",fontSize:13,color:"#374151",lineHeight:1.8,whiteSpace:"pre-wrap",background:"#fff",padding:"12px",borderRadius:10,border:"1px solid #E5E7EB"}}>{lib.text}</div></div>)}
                      </div>
                    );});
                  })()}
                </div>
              )}
              {libSubTab==="styles"&&(
                <div>
                  {library.filter(function(l){return l.analysis;}).length===0
                    ?<div style={sy.emptyBox}><div style={{fontSize:36,marginBottom:10}}>{"🎨"}</div><p style={{color:"#6B7280",fontSize:13}}>{"분석된 스타일이 없습니다."}</p></div>
                    :library.filter(function(l){return l.analysis;}).map(function(lib){var isActive=activeLib===lib.id;return(
                      <div key={lib.id} style={{...sy.libCard,...(isActive?sy.libCardOn:{})}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
                          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{lib.name}</div><div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{lib.date}{" · 파일 "}{lib.fileCount}{"개"}</div></div>
                          <div style={{display:"flex",gap:6}}>
                            <button style={{...sy.useBtn,...(isActive?sy.useBtnOn:{})}} onClick={function(){if(isActive)setActiveLib(null);else{setActiveLib(lib.id);setMainTab("sermon");}}}>{isActive?"✓ 사용 중":"사용하기"}</button>
                            <button style={sy.delBtnSm} onClick={function(){deleteLib(lib.id);}}>{"DEL"}</button>
                          </div>
                        </div>
                        {lib.analysis&&<div style={{background:"#F8FAFF",borderTop:"1px solid #E5E7EB",padding:"12px 16px"}}>{[["설교 스타일",lib.analysis.preachingStyle],["언어 톤",lib.analysis.toneAndVoice],["구조 패턴",lib.analysis.structurePattern],["신학 강조",lib.analysis.theologicalEmphasis],["자주 쓰는 표현",lib.analysis.keyPhrases],["종합 요약",lib.analysis.summary]].map(function(row,ri){return(<div key={ri} style={{display:"flex",gap:10,padding:"5px 0",borderBottom:ri<5?"1px solid #F1F5F9":"none",flexWrap:"wrap"}}><span style={{fontSize:11,fontWeight:700,color:"#6B7280",minWidth:80,flexShrink:0}}>{row[0]}</span><span style={{fontSize:12,color:ri===5?"#1D4ED8":"#374151",lineHeight:1.6,flex:1,fontWeight:ri===5?600:400}}>{row[1]}</span></div>);})}  </div>}
                      </div>
                    );})}
                </div>
              )}
            </div>
          )}

          {mainTab==="saved"&&(
            <div>
              <div style={sy.pageTitle}>{"💾 저장된 설교"}</div>
              <div style={sy.card}>
                <div style={{display:"flex",alignItems:"center",marginBottom:12,gap:8,flexWrap:"wrap"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#111827",flex:1}}>{"설교 "}{savedSermons.length}{"편 · 키아즘 "}{savedChiasms.length}{"개"}</div>
                  <button style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid #E5E7EB",background:showBackup?"#1D4ED8":"#F9FAFB",color:showBackup?"#fff":"#6B7280",fontSize:12,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setShowBackup(!showBackup);setImportJson("");setImportMsg("");}}>
                    {showBackup?"✕ 닫기":"🔄 백업 / 복원"}
                  </button>
                </div>
                {showBackup&&(
                  <div style={{marginBottom:14}}>
                    {FS_API_SUPPORTED&&(
                      <div style={{background:_dirHandle?"#F0FDF4":"#EFF6FF",borderRadius:12,padding:"12px",marginBottom:8,border:"1.5px solid "+(_dirHandle?"#BBF7D0":"#BFDBFE")}}>
                        <div style={{fontSize:12,fontWeight:700,color:_dirHandle?"#15803D":"#1D4ED8",marginBottom:5}}>{_dirHandle?"📁 폴더 자동 저장 연결됨":"📁 폴더 자동 저장 (권장)"}</div>
                        {_dirHandle
                          ?<div><p style={{fontSize:12,color:"#15803D",fontWeight:600,marginBottom:5}}>{"✅ ["}{folderName}{"] 폴더에 자동 저장 중"}</p><button style={{padding:"6px 14px",borderRadius:10,border:"1.5px solid #BBF7D0",background:"#fff",color:"#15803D",fontSize:12,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={handlePickFolder}>{"📁 폴더 변경"}</button></div>
                          :<div><p style={{fontSize:12,color:"#6B7280",marginBottom:7,lineHeight:1.5}}>{"폴더를 한 번만 선택하면 저장할 때마다 자동으로 그 폴더에 저장됩니다."}</p><button style={{padding:"8px 18px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#1D4ED8,#4F46E5)",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={handlePickFolder}>{"📁 저장 폴더 선택하기"}</button></div>
                        }
                      </div>
                    )}
                    <div style={{background:"#F8FAFF",borderRadius:12,padding:"12px",marginBottom:8,border:"1.5px solid #E5E7EB"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:5}}>{"⬇️ 수동 백업"}</div>
                      <button style={{padding:"7px 16px",borderRadius:10,border:"none",background:"#374151",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={downloadBackup}>{_dirHandle?"📁 지금 저장":"⬇️ 파일로 다운로드"}</button>
                    </div>
                    <div style={{background:"#F0FDF4",borderRadius:12,padding:"12px",marginBottom:8,border:"1.5px solid #BBF7D0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#15803D",marginBottom:5}}>{"📂 파일에서 복원"}</div>
                      <input ref={importFileRef} type="file" accept=".json" style={{display:"none"}} onChange={handleImportFile}/>
                      <button style={{padding:"7px 16px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#15803D,#16A34A)",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){if(importFileRef.current)importFileRef.current.click();}}>{"📂 백업 파일 선택해서 복원"}</button>
                    </div>
                    <div style={{background:"#FAFAFA",borderRadius:12,padding:"12px",border:"1.5px solid #E5E7EB"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",marginBottom:4}}>{"📋 텍스트 붙여넣기 (보조)"}</div>
                      <textarea style={{width:"100%",height:60,padding:"8px",borderRadius:8,border:"1.5px solid #E5E7EB",fontSize:11,fontFamily:"monospace",color:"#374151",background:"#fff",resize:"vertical",outline:"none",marginBottom:5}} placeholder="JSON 백업 내용을 붙여넣어도 복원됩니다..." value={importJson} onChange={function(e){setImportJson(e.target.value);setImportMsg("");}}/>
                      {importJson.trim()&&<button style={{padding:"5px 12px",borderRadius:8,border:"none",background:"#6B7280",color:"#fff",fontSize:11,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={importFromJson}>{"텍스트로 복원"}</button>}
                    </div>
                    {importMsg&&<p style={{fontSize:12,marginTop:8,padding:"7px 12px",borderRadius:8,background:importStatus==="ok"?"#F0FDF4":"#FFF5F5",color:importStatus==="ok"?"#15803D":"#DC2626",fontWeight:600,border:"1px solid "+(importStatus==="ok"?"#BBF7D0":"#FEE2E2")}}>{importMsg}</p>}
                  </div>
                )}
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <input style={{...sy.nameInput,flex:2,minWidth:160}} placeholder="🔍 제목, 구절, 내용으로 검색..." value={searchQuery} onChange={function(e){setSearchQuery(e.target.value);}}/>
                  <select style={{...sy.sel,flex:1,minWidth:110}} value={filterLevel} onChange={function(e){setFilterLevel(e.target.value);}}>
                    <option value="all">{"전체"}</option><option value="children">{"🌱 유치부"}</option><option value="youth">{"🔥 청소년부"}</option><option value="adult">{"✝ 성인부"}</option>
                  </select>
                </div>
              </div>
              {savedSermons.length===0?<div style={sy.emptyBox}><div style={{fontSize:36,marginBottom:10}}>{"💾"}</div><p style={{color:"#6B7280",fontSize:13}}>{"아직 저장된 설교가 없습니다."}</p></div>
                :filteredSermons.length===0?<div style={sy.emptyBox}><p style={{color:"#9CA3AF",fontSize:13}}>{"검색 결과가 없습니다."}</p></div>
                :<div>{filteredSermons.map(function(s){var sLv=LEVELS[s.level];return(
                  <div key={s.id} style={sy.sermonCard}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:sLv.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{sLv.emoji}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#111827",marginBottom:2}}>{s.title}</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:3}}>
                          <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,background:sLv.bg,color:sLv.color,border:"1px solid "+sLv.border}}>{sLv.label}</span>
                          <span style={{fontSize:11,color:"#6B7280",padding:"2px 8px",background:"#F1F5F9",borderRadius:20}}>{s.refLabel}</span>
                          {s.styleName&&<span style={{fontSize:11,color:"#7C3AED",padding:"2px 8px",background:"#F5F3FF",borderRadius:20}}>{"🎨 "}{s.styleName}</span>}
                        </div>
                        <div style={{fontSize:11,color:"#9CA3AF"}}>{"📅 "}{s.date}{" "}{s.time}</div>
                        <p style={{fontSize:12,color:"#6B7280",marginTop:4,lineHeight:1.5,overflow:"hidden",maxHeight:32}}>{s.content.replace(/[#*]/g,"").slice(0,80)}{"..."}</p>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                        <button style={sy.viewBtn} onClick={function(){setViewSermon(s);}}>{"View"}</button>
                        <button style={sy.delBtnSm} onClick={function(){setDeleteConfirm(s.id);}}>{"DEL"}</button>
                      </div>
                    </div>
                    {deleteConfirm===s.id&&(<div style={sy.confirmBox}><p style={{fontSize:13,color:"#374151",marginBottom:10}}>{"삭제할까요?"}</p><div style={{display:"flex",gap:8}}><button style={sy.modalCancelBtn} onClick={function(){setDeleteConfirm(null);}}>{"취소"}</button><button style={{...sy.modalSaveBtn,background:"linear-gradient(135deg,#DC2626,#B91C1C)"}} onClick={function(){deleteSermon(s.id);}}>{"삭제"}</button></div></div>)}
                  </div>
                );})}</div>
              }
              {savedChiasms.length>0&&(
                <div style={{marginTop:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:8,paddingLeft:4}}>{"저장된 키아즘 연구 ("}{savedChiasms.length}{"개)"}</div>
                  {savedChiasms.map(function(c){return(
                    <div key={c.id} style={sy.sermonCard}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
                        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{"🔁"}</div>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#111827",marginBottom:2}}>{c.title}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{c.refLabel}{" · "}{c.frame}{"단 · "}{c.date}</div></div>
                        <button style={sy.viewBtn} onClick={function(){setViewChiasm(c);}}>{"View"}</button>
                        <button style={sy.delBtnSm} onClick={function(){setChiasmDeleteConfirm(c.id);}}>{"DEL"}</button>
                      </div>
                      {chiasmDeleteConfirm===c.id&&(<div style={sy.confirmBox}><p style={{fontSize:13,color:"#374151",marginBottom:10}}>{"삭제할까요?"}</p><div style={{display:"flex",gap:8}}><button style={sy.modalCancelBtn} onClick={function(){setChiasmDeleteConfirm(null);}}>{"취소"}</button><button style={{...sy.modalSaveBtn,background:"linear-gradient(135deg,#DC2626,#B91C1C)"}} onClick={function(){deleteChiasm(c.id);}}>{"삭제"}</button></div></div>)}
                    </div>
                  );})}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {viewSermon&&(function(){
        var vLv=LEVELS[viewSermon.level];
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:300,display:"flex",flexDirection:"column"}}>
            <div style={{background:"linear-gradient(135deg,#1E3A8A,#1D4ED8)",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              <button style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid rgba(255,255,255,.4)",background:"rgba(255,255,255,.1)",color:"#fff",fontSize:13,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setViewSermon(null);setShowExport(false);}}>{"← 목록으로"}</button>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:700,color:"#F0F9FF"}}>{viewSermon.title}</div><div style={{fontSize:11,color:"rgba(255,255,255,.65)",marginTop:1}}>{viewSermon.date}{" · "}{viewSermon.refLabel}</div></div>
              <button style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid rgba(255,255,255,.3)",background:"rgba(255,255,255,.1)",color:"#E2E8F0",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setShowExport(!showExport);}}>{"📋 Export"}</button>
              <button style={{padding:"5px 10px",borderRadius:20,border:"1.5px solid #FEE2E2",background:"rgba(239,68,68,.15)",color:"#FCA5A5",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setDeleteConfirm(viewSermon.id);}}>{"DEL"}</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px",background:"#F1F5F9"}}>
              {showExport&&(<div style={sy.card}><div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:6}}>{"📋 텍스트 내보내기"}</div><p style={{fontSize:12,color:"#6B7280",marginBottom:8}}>{"텍스트 박스 클릭 → 전체선택(Ctrl+A) → 복사(Ctrl+C) → 한글/워드에 붙여넣기"}</p><textarea readOnly style={{width:"100%",height:280,padding:"12px",borderRadius:10,border:"1.5px solid #E5E7EB",fontSize:12,fontFamily:"'Noto Sans KR',sans-serif",color:"#374151",background:"#F9FAFB",resize:"vertical",lineHeight:1.7,outline:"none"}} value={makeExportText(viewSermon.title,viewSermon.refLabel,viewSermon.korLines||[],viewSermon.content)} onClick={function(e){e.target.select();}}/></div>)}
              <div style={{...sy.resultCard,borderColor:vLv.border,marginBottom:12}}>
                <div style={{...sy.resultHead,background:vLv.gradient}}>
                  <span style={{fontSize:20}}>{vLv.emoji}</span>
                  <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Noto Serif KR',serif"}}>{viewSermon.title}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:1}}>{viewSermon.refLabel}{" · "}{viewSermon.levelLabel}{viewSermon.styleName?" · "+viewSermon.styleName+" 스타일":""}</div></div>
                </div>
                <div style={{...sy.resultBody,background:vLv.bg}}>
                  {viewSermon.korLines&&viewSermon.korLines.length>0&&(<div style={{marginBottom:14,padding:"12px",background:"rgba(255,255,255,.7)",borderRadius:10,border:"1px solid "+vLv.border}}><span style={sy.badgeKor}>{"🇰🇷 본문 말씀"}</span><div style={{marginTop:5}}>{viewSermon.korLines.map(function(l,i){return <p key={i} style={{fontSize:14,color:"#111827",lineHeight:1.9,fontFamily:"'Noto Serif KR',serif",fontWeight:500}}>{l}</p>;})}</div></div>)}
                  {renderMd(viewSermon.content)}
                </div>
              </div>
              {deleteConfirm===viewSermon.id&&(<div style={{...sy.card,background:"#FFF5F5",border:"1.5px solid #FEE2E2"}}><p style={{fontSize:13,color:"#374151",marginBottom:10}}>{"이 설교를 삭제할까요?"}</p><div style={{display:"flex",gap:8}}><button style={sy.modalCancelBtn} onClick={function(){setDeleteConfirm(null);}}>{"취소"}</button><button style={{...sy.modalSaveBtn,background:"linear-gradient(135deg,#DC2626,#B91C1C)"}} onClick={function(){deleteSermon(viewSermon.id);}}>{"삭제"}</button></div></div>)}
            </div>
          </div>
        );
      })()}

      {viewChiasm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:300,display:"flex",flexDirection:"column"}}>
          <div style={{background:"linear-gradient(135deg,#7C3AED,#6D28D9)",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <button style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid rgba(255,255,255,.4)",background:"rgba(255,255,255,.1)",color:"#fff",fontSize:13,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setViewChiasm(null);}}>{"← 목록으로"}</button>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:700,color:"#F0F9FF"}}>{viewChiasm.title}</div><div style={{fontSize:11,color:"rgba(255,255,255,.65)",marginTop:1}}>{viewChiasm.date}{" · "}{viewChiasm.refLabel}{" · "}{viewChiasm.frame}{"단"}</div></div>
            <button style={{padding:"5px 10px",borderRadius:20,border:"1.5px solid #FEE2E2",background:"rgba(239,68,68,.15)",color:"#FCA5A5",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"}} onClick={function(){setChiasmDeleteConfirm(viewChiasm.id);}}>{"DEL"}</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"20px 24px",background:"#F1F5F9"}}>
            {chiasmDeleteConfirm===viewChiasm.id&&(<div style={{...sy.card,background:"#FFF5F5",border:"1.5px solid #FEE2E2",marginBottom:10}}><p style={{fontSize:13,color:"#374151",marginBottom:10}}>{"이 키아즘 연구를 삭제할까요?"}</p><div style={{display:"flex",gap:8}}><button style={sy.modalCancelBtn} onClick={function(){setChiasmDeleteConfirm(null);}}>{"취소"}</button><button style={{...sy.modalSaveBtn,background:"linear-gradient(135deg,#DC2626,#B91C1C)"}} onClick={function(){deleteChiasm(viewChiasm.id);}}>{"삭제"}</button></div></div>)}
            <div style={sy.card}>
              <div style={sy.cardTitle}>{"🔁 키아즘 구조 ("}{viewChiasm.frame}{"단)"}</div>
              <div style={{marginBottom:8}}><span style={{fontSize:12,color:"#6B7280"}}>{"중심절: "}</span><span style={{fontSize:13,fontWeight:600,color:"#7C3AED"}}>{viewChiasm.center}</span></div>
              {viewChiasm.labels.map(function(label,i){var isC=label.indexOf("중심")>-1;return(<div key={i} style={{display:"flex",gap:10,padding:"7px 10px",marginBottom:3,borderRadius:8,background:isC?"#F5F3FF":"#F8FAFC",border:isC?"2px solid #7C3AED":"1px solid #E5E7EB"}}><span style={{fontWeight:700,color:isC?"#7C3AED":"#4F46E5",minWidth:50,fontSize:12}}>{label}</span><span style={{fontSize:13,color:"#374151",flex:1}}>{viewChiasm.structure[i]||""}</span></div>);})}
            </div>
            <div style={{...sy.resultCard,borderColor:"#DDD6FE",marginBottom:12}}>
              <div style={{...sy.resultHead,background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}}>
                <span style={{fontSize:20}}>{"🔁"}</span>
                <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Noto Serif KR',serif"}}>{viewChiasm.title}</div><div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:1}}>{viewChiasm.refLabel}{" · "}{viewChiasm.frame}{"단"}</div></div>
              </div>
              <div style={{...sy.resultBody,background:"#FAF5FF"}}>
                {renderMd(viewChiasm.analysis)}
                {viewChiasm.memo&&(<div style={{marginTop:16,padding:"14px",background:"#F5F3FF",borderRadius:12,border:"2px solid #DDD6FE"}}><div style={{fontSize:13,fontWeight:700,color:"#7C3AED",marginBottom:6}}>{"✏️ 나의 분석 메모"}</div><p style={{fontSize:13,color:"#374151",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{viewChiasm.memo}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveModal&&(<div style={sy.modalOverlay}><div style={sy.modal}><div style={sy.modalTitle}>{"💾 설교 저장하기"}</div><p style={{fontSize:13,color:"#6B7280",marginBottom:14}}>{refLabel}{" · "}{LEVELS[level].label}</p><div style={sy.selLabel}>{"설교 제목"}</div><input style={{...sy.nameInput,marginBottom:8}} value={saveTitle} onChange={function(e){setSaveTitle(e.target.value);}} placeholder="저장할 설교 제목을 입력하세요"/>{saveMsg&&<p style={{color:"#DC2626",fontSize:12,marginBottom:8}}>{"⚠️ "}{saveMsg}</p>}<div style={{display:"flex",gap:10,marginTop:8}}><button style={sy.modalCancelBtn} onClick={function(){setShowSaveModal(false);}}>{"CANCEL"}</button><button style={sy.modalSaveBtn} onClick={saveSermon}>{"저장"}</button></div></div></div>)}

      {showChiasmSaveModal&&(<div style={sy.modalOverlay}><div style={sy.modal}>
  <div style={sy.modalTitle}>{chiasmSaveType==="chiasm"?"🔁 키아즘 연구 저장":"🔁 키아즘 설교 저장"}</div>
  <p style={{fontSize:13,color:"#6B7280",marginBottom:10}}>{refLabel}</p>
  {chiasmSaveType==="chiasmSermon"&&<p style={{fontSize:12,color:"#7C3AED",background:"#F5F3FF",padding:"8px 12px",borderRadius:8,marginBottom:12,lineHeight:1.6}}>{"💡 키아즘 분석과 설교가 함께 저장됩니다. 저장 후 처음으로 돌아갑니다."}</p>}
  {chiasmSaveType==="chiasm"&&<p style={{fontSize:12,color:"#059669",background:"#F0FDF4",padding:"8px 12px",borderRadius:8,marginBottom:12,lineHeight:1.6}}>{"💡 키아즘 분석이 저장됩니다. 현재 화면은 유지됩니다."}</p>}
  <div style={sy.selLabel}>{"제목"}</div>
  <input style={{...sy.nameInput,marginBottom:8,border:"1.5px solid #DDD6FE"}} value={chiasmSaveTitle} onChange={function(e){setChiasmSaveTitle(e.target.value);}} placeholder="저장할 제목을 입력하세요"/>
  {chiasmSaveMsg&&<p style={{color:"#DC2626",fontSize:12,marginBottom:8}}>{"⚠️ "}{chiasmSaveMsg}</p>}
  <div style={{display:"flex",gap:10,marginTop:8}}>
    <button style={sy.modalCancelBtn} onClick={function(){setShowChiasmSaveModal(false);}}>{"CANCEL"}</button>
    <button style={{...sy.modalSaveBtn,background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}} onClick={saveChiasmAll}>{chiasmSaveType==="chiasm"?"💾 저장":"💾 저장 후 처음으로"}</button>
  </div>
</div></div>)}

      <style>{`*{box-sizing:border-box;margin:0;padding:0;}@keyframes spin{to{transform:rotate(360deg);}}select,input{appearance:auto;outline:none;}button{transition:all .15s ease;cursor:pointer;}button:hover:not(:disabled){opacity:.88;}::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#F1F5F9;}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px;}`}</style>
    </div>
  );
}

const sy={
  pageTitle:{fontSize:20,fontWeight:700,color:"#111827",fontFamily:"'Noto Serif KR',serif",marginBottom:16,paddingBottom:10,borderBottom:"2px solid #E5E7EB"},
  card:{background:"#fff",borderRadius:16,padding:"20px",marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,.08)",border:"1px solid #E5E7EB"},
  cardTitle:{fontSize:14,fontWeight:700,color:"#111827",marginBottom:12,fontFamily:"'Noto Serif KR',serif"},
  dim:{fontSize:12,fontWeight:400,color:"#9CA3AF"},
  selLabel:{fontSize:12,fontWeight:600,color:"#6B7280",marginBottom:5},
  sel:{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #E5E7EB",fontSize:13,color:"#111827",background:"#F9FAFB",fontFamily:"'Noto Sans KR',sans-serif"},
  nameInput:{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid #E5E7EB",fontSize:14,color:"#111827",background:"#F9FAFB",fontFamily:"'Noto Sans KR',sans-serif"},
  infoTag:{padding:"8px 14px",background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:10,fontSize:13,color:"#1D4ED8",marginBottom:12},
  infoTagGreen:{padding:"8px 14px",background:"#F0FDF4",border:"1.5px solid #BBF7D0",borderRadius:10,fontSize:13,color:"#15803D",marginBottom:12},
  hint:{padding:"8px 14px",background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:10,fontSize:12,color:"#92400E",marginBottom:12},
  rangeWrap:{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"},
  rangeGroup:{flex:1,minWidth:180,background:"#F8FAFC",border:"1.5px solid #E5E7EB",borderRadius:12,padding:"12px 14px"},
  rangeLabel:{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8},
  arrow:{fontSize:20,color:"#9CA3AF",fontWeight:700,userSelect:"none",flexShrink:0,alignSelf:"center"},
  verseCard:{background:"#fff",borderRadius:16,overflow:"hidden",border:"2px solid #DBEAFE",marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,.08)"},
  verseHead:{background:"linear-gradient(135deg,#1E3A8A,#1D4ED8)",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},
  verseRef:{color:"#fff",fontFamily:"'Noto Serif KR',serif",fontSize:14,fontWeight:700},
  kjvBadge:{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:600},
  langBtn:{padding:"3px 10px",borderRadius:20,border:"1.5px solid rgba(255,255,255,.35)",background:"transparent",color:"rgba(255,255,255,.65)",fontSize:11,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif"},
  langBtnOn:{background:"rgba(255,255,255,.25)",color:"#fff",border:"1.5px solid rgba(255,255,255,.8)"},
  badgeKor:{display:"inline-block",background:"#FFF1F2",border:"1px solid #FECDD3",color:"#BE123C",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,marginBottom:5},
  badgeEng:{display:"inline-block",background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1D4ED8",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,marginBottom:5},
  themeBadge:{padding:"3px 10px",background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:20,fontSize:11,color:"#1D4ED8",fontWeight:600},
  lvBtn:{flex:1,minWidth:110,padding:"13px 8px",background:"#F9FAFB",border:"2px solid #E5E7EB",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"},
  saveBtn:{padding:"7px 14px",borderRadius:20,border:"2px solid rgba(255,255,255,.5)",background:"rgba(255,255,255,.15)",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",flexShrink:0},
  resultCard:{borderRadius:16,border:"2px solid",overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.12)"},
  resultHead:{padding:"14px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},
  resultBody:{padding:"20px"},
  loadBox:{textAlign:"center",padding:"40px 0"},
  loadTxt:{color:"#374151",fontSize:14,fontWeight:600,marginBottom:4},
  sermonCard:{background:"#fff",borderRadius:14,marginBottom:8,boxShadow:"0 2px 10px rgba(0,0,0,.08)",overflow:"hidden",border:"1px solid #E5E7EB"},
  viewBtn:{padding:"5px 11px",borderRadius:8,border:"1.5px solid #BFDBFE",background:"#EFF6FF",color:"#1D4ED8",fontSize:11,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif"},
  delBtnSm:{padding:"5px 9px",borderRadius:8,border:"1.5px solid #FEE2E2",background:"#FFF5F5",color:"#EF4444",fontSize:11,fontFamily:"'Noto Sans KR',sans-serif"},
  confirmBox:{background:"#FFF5F5",borderTop:"1px solid #FEE2E2",padding:"12px 16px"},
  emptyBox:{textAlign:"center",padding:"40px 24px",background:"#F9FAFB",borderRadius:16,border:"1px dashed #E5E7EB"},
  dropArea:{border:"2px dashed #BFDBFE",borderRadius:12,padding:"20px",textAlign:"center",cursor:"pointer",background:"#F8FAFF",minHeight:90,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},
  fileItem:{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#EFF6FF",borderRadius:7,marginBottom:5},
  libCard:{background:"#fff",borderRadius:14,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.08)",border:"2px solid transparent"},
  libCardOn:{border:"2px solid #3B82F6",boxShadow:"0 4px 16px rgba(59,130,246,.2)"},
  useBtn:{padding:"5px 12px",borderRadius:20,border:"1.5px solid #E5E7EB",background:"#F9FAFB",color:"#6B7280",fontSize:11,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"},
  useBtnOn:{background:"linear-gradient(135deg,#1D4ED8,#4F46E5)",color:"#fff",border:"1.5px solid transparent"},
  modalOverlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16},
  modal:{background:"#fff",borderRadius:20,padding:"26px 22px",width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,.3)"},
  modalTitle:{fontSize:17,fontWeight:700,color:"#111827",marginBottom:6,fontFamily:"'Noto Serif KR',serif"},
  modalCancelBtn:{flex:1,padding:"11px",borderRadius:10,border:"1.5px solid #E5E7EB",background:"#F9FAFB",color:"#6B7280",fontSize:13,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"},
  modalSaveBtn:{flex:1,padding:"11px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#1D4ED8,#4F46E5)",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",cursor:"pointer"},
  spin:{width:18,height:18,border:"2px solid #E5E7EB",borderTop:"2px solid #1D4ED8",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0},
  spinSm:{width:14,height:14,border:"2px solid rgba(255,255,255,.4)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"},
  spinSm2:{width:14,height:14,border:"2px solid #BFDBFE",borderTop:"2px solid #1D4ED8",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0},
  spinLg:{width:38,height:38,border:"3px solid #E5E7EB",borderTop:"3px solid #1D4ED8",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 14px"},
  h2:{fontFamily:"'Noto Serif KR',serif",fontSize:15,fontWeight:700,color:"#111827",marginTop:18,marginBottom:7,paddingBottom:5,borderBottom:"2px solid #E5E7EB"},
  h3:{fontFamily:"'Noto Serif KR',serif",fontSize:13,fontWeight:600,color:"#374151",marginTop:12,marginBottom:4},
  para:{color:"#374151",fontSize:14,marginBottom:3,lineHeight:1.85},
  li:{color:"#374151",fontSize:14,marginBottom:3,paddingLeft:8,lineHeight:1.85},
  bullet:{color:"#374151",fontSize:14,marginBottom:3,paddingLeft:12,lineHeight:1.85},
};
