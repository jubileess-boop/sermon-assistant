'use client'

import { useState, useEffect, useRef } from 'react'

// ── 장별 실제 절 수 ──
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
}
const ALL_BOOKS = [...BIBLE_BOOKS.구약, ...BIBLE_BOOKS.신약]

const LEVELS = {
  children:{label:'유치부',emoji:'🌱',age:'5~7세',color:'#D97706',gradient:'linear-gradient(135deg,#F59E0B,#D97706)',bg:'#FFFBEB',border:'#FDE68A'},
  youth:   {label:'청소년부',emoji:'🔥',age:'13~19세',color:'#4F46E5',gradient:'linear-gradient(135deg,#6366F1,#4F46E5)',bg:'#EEF2FF',border:'#C7D2FE'},
  adult:   {label:'성인부',emoji:'✝️',age:'20세 이상',color:'#1D4ED8',gradient:'linear-gradient(135deg,#2563EB,#1D4ED8)',bg:'#EFF6FF',border:'#BFDBFE'},
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
}

function getVerseCount(bookName, chapNum) {
  const arr = VERSE_COUNTS[bookName]
  if (!arr) return 30
  return arr[chapNum - 1] || 30
}

function buildVerseList(book, fc, fv, tc, tv) {
  const list = []
  for (let c = fc; c <= tc; c++) {
    const maxV = getVerseCount(book, c)
    const sv = c === fc ? fv : 1
    const ev = c === tc ? Math.min(tv, maxV) : maxV
    for (let v = sv; v <= ev; v++) list.push({ chap: c, verse: v })
  }
  return list
}

function makeRefLabel(book, fc, fv, tc, tv) {
  if (!book || !fc || !fv || !tc || !tv) return ''
  if (fc === tc) return fv === tv ? `${book} ${fc}장 ${fv}절` : `${book} ${fc}장 ${fv}~${tv}절`
  return `${book} ${fc}장 ${fv}절 ~ ${tc}장 ${tv}절`
}

// Claude API 호출 - 서버 프록시 사용 (API 키 보호)
async function callClaude(system, userMsg, maxTokens = 400) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

function makeSystemPrompt(levelKey, styleProfile) {
  const base = {
    children: '당신은 유치부(5~7세) 전문 설교 작성 도우미입니다.',
    youth:    '당신은 청소년부(중고등학생) 전문 설교 작성 도우미입니다.',
    adult:    '당신은 성인 예배 전문 설교 작성 도우미입니다.',
  }[levelKey]
  let styleSection = ''
  if (styleProfile) {
    styleSection = `\n\n[이 목사님의 고유 설교 스타일을 반드시 반영하세요]
- 설교 스타일: ${styleProfile.preachingStyle}
- 언어 톤/어조: ${styleProfile.toneAndVoice}
- 구조 패턴: ${styleProfile.structurePattern}
- 신학적 강조: ${styleProfile.theologicalEmphasis}
- 자주 쓰는 표현: ${styleProfile.keyPhrases}
- 적용 방식: ${styleProfile.applicationStyle}`
  }
  return base + styleSection + '\n\n' + FORMAT_PROMPTS[levelKey]
}

function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'txt') return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = e => res(e.target.result.trim())
    r.onerror = () => rej(new Error('파일 읽기 실패'))
    r.readAsText(file, 'UTF-8')
  })
  if (ext === 'pdf') return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = async e => {
      const lib = window['pdfjs-dist/build/pdf']
      if (!lib) { rej(new Error('PDF 라이브러리 미로드')); return }
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      const pdf = await lib.getDocument({ data: e.target.result }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(x => x.str).join(' ') + '\n'
      }
      res(text.trim())
    }
    r.onerror = () => rej(new Error('파일 읽기 실패'))
    r.readAsArrayBuffer(file)
  })
  if (ext === 'docx') return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = async e => {
      const m = window.mammoth
      if (!m) { rej(new Error('DOCX 라이브러리 미로드')); return }
      const result = await m.extractRawText({ arrayBuffer: e.target.result })
      res(result.value.trim())
    }
    r.onerror = () => rej(new Error('파일 읽기 실패'))
    r.readAsArrayBuffer(file)
  })
  return Promise.reject(new Error('지원하지 않는 파일 형식입니다.'))
}

function renderMd(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## '))  return <h2 key={i} style={sy.h2}>{line.slice(3)}</h2>
    if (line.startsWith('### ')) return <h3 key={i} style={sy.h3}>{line.slice(4)}</h3>
    if (/^\d+\./.test(line))     return <p  key={i} style={sy.li}>{line}</p>
    if (line.startsWith('- '))   return <p  key={i} style={sy.bullet}>{'• ' + line.slice(2)}</p>
    if (!line.trim())            return <div key={i} style={{ height: 6 }} />
    return <p key={i} style={sy.para}>{line}</p>
  })
}

const STORAGE_SERMONS = 'sermons-v1'
const STORAGE_LIBRARY = 'library-v1'

function saveToLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch(e) {}
}
function loadFromLS(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null } catch(e) { return null }
}

export default function Home() {
  const [mainTab,   setMainTab]   = useState('bible')
  const [book,      setBook]      = useState('')
  const [fromChap,  setFromChap]  = useState('')
  const [fromVerse, setFromVerse] = useState('')
  const [toChap,    setToChap]    = useState('')
  const [toVerse,   setToVerse]   = useState('')
  const [level,     setLevel]     = useState('adult')
  const [korLines,  setKorLines]  = useState([])
  const [engText,   setEngText]   = useState('')
  const [korCtx,    setKorCtx]    = useState('')
  const [themes,    setThemes]    = useState([])
  const [showLang,  setShowLang]  = useState('both')
  const [vLoading,  setVLoading]  = useState(false)
  const [vError,    setVError]    = useState('')
  const [loaded,    setLoaded]    = useState(0)
  const [total,     setTotal]     = useState(0)
  const [sermonOut, setSermonOut] = useState('')
  const [sLoading,  setSLoading]  = useState(false)
  const [savedSermons, setSavedSermons] = useState([])
  const [saveTitle,    setSaveTitle]    = useState('')
  const [showSaveModal,setShowSaveModal]= useState(false)
  const [saveMsg,      setSaveMsg]      = useState('')
  const [viewSermon,   setViewSermon]   = useState(null)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [filterLevel,  setFilterLevel]  = useState('all')
  const [deleteConfirm,setDeleteConfirm]= useState(null)
  const [library,   setLibrary]   = useState([])
  const [activeLib, setActiveLib] = useState(null)
  const [upName,    setUpName]    = useState('')
  const [upFiles,   setUpFiles]   = useState([])
  const [upLoading, setUpLoading] = useState(false)
  const [upError,   setUpError]   = useState('')
  const [upProgress,setUpProgress]= useState('')
  const [saveStatus,setSaveStatus]= useState('')
  const fileRef = useRef()

  const bookInfo    = ALL_BOOKS.find(b => b.name === book)
  const maxChap     = bookInfo?.chapters || 0
  const toChapOpts  = fromChap ? Array.from({length: maxChap - parseInt(fromChap) + 1}, (_, i) => i + parseInt(fromChap)) : []
  const fromVerseMax = fromChap ? getVerseCount(book, parseInt(fromChap)) : 30
  const toVerseMax   = toChap   ? getVerseCount(book, parseInt(toChap))   : 30
  const toVerseOpts  = toChap
    ? (parseInt(toChap) === parseInt(fromChap) && fromVerse
        ? Array.from({length: toVerseMax - parseInt(fromVerse) + 1}, (_, i) => i + parseInt(fromVerse))
        : Array.from({length: toVerseMax}, (_, i) => i + 1))
    : []
  const refLabel    = makeRefLabel(book, parseInt(fromChap), parseInt(fromVerse), parseInt(toChap), parseInt(toVerse))
  const verseReady  = korLines.length > 0 && !vLoading
  const activeLibObj = library.find(l => l.id === activeLib) || null
  const lv = LEVELS[level]
  const filteredSermons = savedSermons.filter(s => {
    const mSearch = !searchQuery || s.title.includes(searchQuery) || s.refLabel.includes(searchQuery) || s.content.includes(searchQuery)
    const mLevel  = filterLevel === 'all' || s.level === filterLevel
    return mSearch && mLevel
  })

  useEffect(() => {
    const s = loadFromLS(STORAGE_SERMONS); if (s) setSavedSermons(s)
    const l = loadFromLS(STORAGE_LIBRARY); if (l) setLibrary(l)
  }, [])

  useEffect(() => { setFromChap(''); setFromVerse(''); setToChap(''); setToVerse(''); clearVerse() }, [book])
  useEffect(() => { setFromVerse(''); setToChap(''); setToVerse(''); clearVerse() }, [fromChap])
  useEffect(() => { setToChap(''); setToVerse(''); clearVerse() }, [fromVerse])
  useEffect(() => { setToVerse(''); clearVerse() }, [toChap])
  useEffect(() => { if (book && fromChap && fromVerse && toChap && toVerse) fetchVerses() }, [toVerse])

  function clearVerse() { setKorLines([]); setEngText(''); setKorCtx(''); setThemes([]); setVError(''); setSermonOut(''); setLoaded(0); setTotal(0) }

  async function fetchVerses() {
    setVLoading(true); setVError(''); setKorLines([]); setSermonOut('')
    const list = buildVerseList(book, parseInt(fromChap), parseInt(fromVerse), parseInt(toChap), parseInt(toVerse))
    setTotal(list.length); setLoaded(0)
    const results = []
    try {
      for (const { chap, verse } of list) {
        const text = await callClaude(
          `너는 한국어 개역개정 성경 본문을 정확히 제공하는 도우미야. 요청한 절의 개역개정 본문만 한 줄로 출력해. 형식: "${verse} 본문내용" 다른 설명 없이 본문만.`,
          `${book} ${chap}장 ${verse}절 개역개정 본문`, 300
        )
        const t = text.trim()
        results.push(t.startsWith(String(verse)) ? t : `${verse} ${t}`)
        setKorLines([...results]); setLoaded(results.length)
      }
    } catch(e) { setVError('말씀 오류: ' + e.message); setVLoading(false); return }
    try {
      const ctxRaw = await callClaude('너는 성경 구절 배경을 설명하는 도우미야. 반드시 순수 JSON만 출력해. {"context":"배경 1~2줄","theme":"키워드1,키워드2,키워드3"}', refLabel + ' 배경과 주제', 250)
      const parsed = JSON.parse(ctxRaw.replace(/```json|```/g, '').trim())
      setKorCtx(parsed.context || ''); setThemes((parsed.theme || '').split(/[,，·]+/).map(t => t.trim()).filter(Boolean))
    } catch(e) {}
    try {
      if (parseInt(fromChap) === parseInt(toChap)) {
        const enBook = (bookInfo?.en || '').replace(/ /g, '+')
        const passage = parseInt(fromVerse) === parseInt(toVerse) ? `${enBook}+${fromChap}:${fromVerse}` : `${enBook}+${fromChap}:${fromVerse}-${toVerse}`
        const res = await fetch(`https://bible-api.com/${passage}?translation=kjv`)
        if (res.ok) { const d = await res.json(); setEngText(d.text?.trim() || '') }
      }
    } catch(e) {}
    setVLoading(false)
  }

  async function genSermon() {
    if (!verseReady) return
    setSLoading(true); setSermonOut('')
    const userMsg = `성경 구절: ${refLabel}\n한국어 개역개정:\n${korLines.join('\n')}${engText ? `\n\n영어 KJV:\n"${engText}"` : ''}\n배경: ${korCtx}\n\n위 말씀을 바탕으로 ${lv.label}(${lv.age}) 맞춤 설교를 작성해주세요.`
    try { const out = await callClaude(makeSystemPrompt(level, activeLibObj?.analysis), userMsg, 1500); setSermonOut(out) }
    catch(e) { setSermonOut('❌ 설교 생성 오류: ' + e.message) }
    setSLoading(false)
  }

  function openSaveModal() { if (!sermonOut) return; setSaveTitle(refLabel + ' ' + LEVELS[level].label + ' 설교'); setShowSaveModal(true); setSaveMsg('') }

  function saveSermon() {
    if (!saveTitle.trim()) { setSaveMsg('제목을 입력해주세요.'); return }
    setSaveStatus('saving')
    const entry = { id: Date.now(), title: saveTitle.trim(), refLabel, level, levelLabel: LEVELS[level].label, levelEmoji: LEVELS[level].emoji, content: sermonOut, korLines, themes, styleName: activeLibObj?.name || null, date: new Date().toLocaleDateString('ko-KR'), time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }
    const updated = [entry, ...savedSermons]
    setSavedSermons(updated); saveToLS(STORAGE_SERMONS, updated)
    setSaveStatus('saved'); setTimeout(() => setSaveStatus(''), 3000)
    setShowSaveModal(false); setSaveTitle(''); setSaveMsg(''); setMainTab('saved')
  }

  function deleteSermon(id) {
    const updated = savedSermons.filter(s => s.id !== id)
    setSavedSermons(updated); saveToLS(STORAGE_SERMONS, updated)
    if (viewSermon?.id === id) setViewSermon(null); setDeleteConfirm(null)
  }

  async function handleUpload() {
    if (!upName.trim()) { setUpError('이름을 입력해주세요.'); return }
    if (upFiles.length === 0) { setUpError('파일을 선택해주세요.'); return }
    setUpLoading(true); setUpError(''); setUpProgress('')
    let combinedText = ''
    for (let i = 0; i < upFiles.length; i++) {
      const file = upFiles[i]; setUpProgress(`파일 읽는 중... (${i+1}/${upFiles.length}) ${file.name}`)
      try { combinedText += `\n\n=== ${file.name} ===\n` + await extractText(file) }
      catch(e) { setUpError(file.name + ': ' + e.message); setUpLoading(false); return }
    }
    setUpProgress('설교 스타일 분석 중... (약 10~20초)')
    try {
      const prompt = `아래 설교 원고를 분석하여 이 목사님의 고유한 설교 스타일을 파악해주세요.\n반드시 순수 JSON만 출력하세요:\n{"preachingStyle":"설교 전달 방식 2~3줄","toneAndVoice":"언어 톤과 어조 1~2줄","structurePattern":"구조 패턴 1~2줄","theologicalEmphasis":"신학적 강조점 2~3줄","keyPhrases":"자주 쓰는 표현 3~5가지 (쉼표 구분)","applicationStyle":"삶 적용 방식 1~2줄","summary":"전체 요약 2~3줄"}\n\n설교 원고:\n${combinedText.slice(0, 4000)}`
      const raw = await callClaude('너는 설교 스타일 분석 전문가야. 반드시 순수 JSON만 출력해.', prompt, 800)
      const analysis = JSON.parse(raw.replace(/```json|```/g, '').trim())
      const entry = { id: Date.now(), name: upName.trim(), analysis, date: new Date().toLocaleDateString('ko-KR'), fileCount: upFiles.length }
      const updated = [...library, entry]; setLibrary(updated); saveToLS(STORAGE_LIBRARY, updated)
      setActiveLib(entry.id); setUpName(''); setUpFiles([]); setUpProgress('')
      if (fileRef.current) fileRef.current.value = ''; setMainTab('bible')
    } catch(e) { setUpError('분석 오류: ' + e.message) }
    setUpLoading(false)
  }

  function deleteLib(id) {
    const updated = library.filter(l => l.id !== id); setLibrary(updated); saveToLS(STORAGE_LIBRARY, updated)
    if (activeLib === id) setActiveLib(null)
  }

  if (viewSermon) {
    const vLv = LEVELS[viewSermon.level]
    return (
      <div style={sy.root}>
        <div style={sy.orb1}/><div style={sy.orb2}/>
        <div style={sy.wrap}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
            <button style={sy.backBtn} onClick={() => setViewSermon(null)}>← 목록으로</button>
            <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:'#F0F9FF'}}>{viewSermon.title}</div><div style={{fontSize:12,color:'#94A3B8',marginTop:2}}>{viewSermon.date} {viewSermon.time} · {viewSermon.refLabel}</div></div>
            <button style={sy.delBtnSm} onClick={() => setDeleteConfirm(viewSermon.id)}>🗑️ 삭제</button>
          </div>
          <div style={{...sy.resultCard,borderColor:vLv.border,marginBottom:16}}>
            <div style={{...sy.resultHead,background:vLv.gradient}}>
              <span style={{fontSize:22}}>{vLv.emoji}</span>
              <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:'#fff',fontFamily:"'Noto Serif KR',serif"}}>{viewSermon.title}</div><div style={{fontSize:12,color:'rgba(255,255,255,.75)',marginTop:2}}>{viewSermon.refLabel} · {viewSermon.levelLabel}{viewSermon.styleName ? ' · ' + viewSermon.styleName + ' 스타일' : ''}</div></div>
            </div>
            <div style={{...sy.resultBody,background:vLv.bg}}>
              {viewSermon.korLines?.length > 0 && (
                <div style={{marginBottom:16,padding:'14px',background:'rgba(255,255,255,.7)',borderRadius:10,border:'1px solid '+vLv.border}}>
                  <span style={sy.badgeKor}>🇰🇷 본문 말씀</span>
                  <div style={{marginTop:6}}>{viewSermon.korLines.map((l,i) => <p key={i} style={{fontSize:14,color:'#111827',lineHeight:1.9,fontFamily:"'Noto Serif KR',serif",fontWeight:500}}>{l}</p>)}</div>
                </div>
              )}
              {renderMd(viewSermon.content)}
            </div>
          </div>
          {deleteConfirm === viewSermon.id && (
            <div style={sy.confirmBox}><p style={{fontSize:13,color:'#374151',marginBottom:10}}>이 설교를 삭제하시겠습니까?</p>
              <div style={{display:'flex',gap:8}}><button style={sy.modalCancelBtn} onClick={() => setDeleteConfirm(null)}>취소</button><button style={{...sy.modalSaveBtn,background:'linear-gradient(135deg,#DC2626,#B91C1C)'}} onClick={() => deleteSermon(viewSermon.id)}>삭제</button></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={sy.root}>
      <div style={sy.orb1}/><div style={sy.orb2}/>
      <div style={sy.wrap}>
        <div style={sy.hdr}>
          <div style={sy.cross}>✝</div>
          <h1 style={sy.title}>설교 비서</h1>
          <p style={sy.sub}>Claude AI · 연령대별 맞춤 설교 · 나만의 스타일 학습 · 영구 저장</p>
          {saveStatus==='saving'&&<div style={sy.saveBar}>💾 저장 중...</div>}
          {saveStatus==='saved'&&<div style={{...sy.saveBar,background:'rgba(20,83,45,.9)',color:'#86EFAC'}}>✅ 저장 완료!</div>}
        </div>

        <div style={{display:'flex',gap:8,marginBottom:14}}>
          {[['bible','📖 설교 생성',null],['saved','💾 저장된 설교',savedSermons.length],['library','📚 스타일 라이브러리',library.length]].map(([key,label,cnt]) => (
            <button key={key} style={{...sy.mainTab,...(mainTab===key?sy.mainTabOn:{})}} onClick={() => setMainTab(key)}>
              {label}{cnt>0&&<span style={sy.tabBadge}>{cnt}</span>}
            </button>
          ))}
        </div>

        {mainTab==='bible'&&(
          <div>
            {activeLibObj&&<div style={sy.styleBanner}><span style={{fontSize:18}}>🎨</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:'#1D4ED8'}}>{activeLibObj.name} 스타일 적용 중</div><div style={{fontSize:11,color:'#6B7280',marginTop:2}}>{activeLibObj.analysis.preachingStyle.slice(0,60)}...</div></div><button style={sy.smallBtn} onClick={() => setActiveLib(null)}>✕ 해제</button></div>}

            <div style={sy.card}>
              <span style={sy.badge}>STEP 1</span>
              <div style={sy.cardTitle}>📚 성경 책 선택 <span style={sy.dim}>(신구약 66권)</span></div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {Object.entries(BIBLE_BOOKS).map(([t,books]) => (
                  <div key={t} style={{flex:1,minWidth:180}}>
                    <div style={sy.selLabel}>{t} · {books.length}권</div>
                    <select style={sy.sel} value={books.find(b => b.name===book)?book:''} onChange={e => e.target.value&&setBook(e.target.value)}>
                      <option value=''>{t} 선택...</option>
                      {books.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              {book&&<div style={sy.infoTag}>📖 <b>{book}</b> — 총 {maxChap}장</div>}
            </div>

            {book&&(
              <div style={sy.card}>
                <span style={sy.badge}>STEP 2</span>
                <div style={sy.cardTitle}>🔢 본문 범위 선택</div>
                <div style={sy.rangeWrap}>
                  <div style={sy.rangeGroup}>
                    <div style={sy.rangeLabel}>📍 시작</div>
                    <div style={{display:'flex',gap:8}}>
                      <div style={{flex:1}}><div style={sy.selLabel}>장</div>
                        <select style={sy.sel} value={fromChap} onChange={e => setFromChap(e.target.value)}>
                          <option value=''>장</option>{Array.from({length:maxChap},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}장</option>)}
                        </select>
                      </div>
                      <div style={{flex:1}}><div style={sy.selLabel}>절 (총 {fromChap?fromVerseMax:'?'}절)</div>
                        <select style={sy.sel} value={fromVerse} onChange={e => setFromVerse(e.target.value)} disabled={!fromChap}>
                          <option value=''>절</option>{Array.from({length:fromVerseMax},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}절</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={sy.arrow}>→</div>
                  <div style={sy.rangeGroup}>
                    <div style={sy.rangeLabel}>🏁 끝</div>
                    <div style={{display:'flex',gap:8}}>
                      <div style={{flex:1}}><div style={sy.selLabel}>장</div>
                        <select style={sy.sel} value={toChap} onChange={e => setToChap(e.target.value)} disabled={!fromVerse}>
                          <option value=''>장</option>{toChapOpts.map(n=><option key={n} value={n}>{n}장</option>)}
                        </select>
                      </div>
                      <div style={{flex:1}}><div style={sy.selLabel}>절 (총 {toChap?toVerseMax:'?'}절)</div>
                        <select style={sy.sel} value={toVerse} onChange={e => setToVerse(e.target.value)} disabled={!toChap}>
                          <option value=''>절</option>{toVerseOpts.map(n=><option key={n} value={n}>{n}절</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {book&&fromChap&&fromVerse&&toChap&&toVerse&&<div style={sy.infoTag}>📌 <b>{refLabel}</b>{total>1&&<span style={{color:'#6B7280',fontWeight:400}}> · 총 {total}절</span>}</div>}
                {!fromChap&&<div style={sy.hint}>💡 시작 장을 먼저 선택하세요.</div>}
                {fromChap&&!fromVerse&&<div style={sy.hint}>💡 시작 절을 선택하세요.</div>}
                {fromVerse&&!toChap&&<div style={sy.hint}>💡 끝 장을 선택하세요. 다음 장도 선택 가능합니다.</div>}
                {toChap&&!toVerse&&<div style={sy.hint}>💡 끝 절을 선택하면 말씀이 자동으로 불러와집니다.</div>}
              </div>
            )}

            {(vLoading||korLines.length>0||vError)&&(
              <div style={sy.verseCard}>
                <div style={sy.verseHead}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <span style={sy.verseRef}>{refLabel||'말씀 불러오는 중...'}</span>
                    {!vLoading&&engText&&<span style={sy.kjvBadge}>KJV ✓</span>}
                    {vLoading&&<span style={{color:'rgba(255,255,255,.7)',fontSize:12}}>({loaded}/{total}절)</span>}
                  </div>
                  {!vLoading&&korLines.length>0&&(
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {[['both','한·영'],['kor','한국어'],['eng','English']].map(([v,l]) => <button key={v} style={{...sy.langBtn,...(showLang===v?sy.langBtnOn:{})}} onClick={() => setShowLang(v)}>{l}</button>)}
                    </div>
                  )}
                </div>
                <div style={{padding:'18px 20px 16px'}}>
                  {vLoading&&<div><div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}><div style={sy.spin}/><div><p style={{fontSize:14,fontWeight:600,color:'#374151'}}>말씀 불러오는 중... ({loaded}/{total}절)</p><div style={{marginTop:6,width:200,height:5,background:'#E5E7EB',borderRadius:9}}><div style={{height:5,borderRadius:9,background:'linear-gradient(90deg,#3B82F6,#6366F1)',width:(total>0?(loaded/total*100):0)+'%',transition:'width .3s'}}/></div></div></div>{korLines.map((l,i)=><p key={i} style={{fontSize:13,color:'#9CA3AF',lineHeight:1.8,fontFamily:"'Noto Serif KR',serif"}}>{l}</p>)}</div>}
                  {vError&&<p style={{color:'#DC2626',fontSize:13}}>⚠️ {vError}</p>}
                  {!vLoading&&korLines.length>0&&<div>
                    {(showLang==='both'||showLang==='kor')&&<div><span style={sy.badgeKor}>🇰🇷 개역개정</span><div style={{marginTop:6}}>{korLines.map((l,i)=><p key={i} style={{fontSize:15,color:'#111827',lineHeight:2,fontFamily:"'Noto Serif KR',serif",fontWeight:500,marginBottom:2}}>{l}</p>)}</div>{korCtx&&<p style={{fontSize:13,color:'#6B7280',marginTop:8}}>📌 {korCtx}</p>}{themes.length>0&&<div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>{themes.map((t,i)=><span key={i} style={sy.themeBadge}>{t}</span>)}</div>}</div>}
                    {showLang==='both'&&engText&&<div style={{height:1,background:'#E5E7EB',margin:'14px 0'}}/>}
                    {(showLang==='both'||showLang==='eng')&&engText&&<div><span style={sy.badgeEng}>🇺🇸 King James Version</span><div style={{marginTop:6}}>{engText.split('\n').map((l,i)=>l.trim()?<p key={i} style={{fontSize:14,color:'#374151',lineHeight:1.9,fontFamily:'Georgia,serif'}}>{l}</p>:null)}</div></div>}
                  </div>}
                </div>
              </div>
            )}

            {verseReady&&(
              <div style={sy.card}>
                <span style={sy.badge}>STEP 3</span>
                <div style={sy.cardTitle}>👥 연령대 선택 및 설교 생성</div>
                <div style={{display:'flex',gap:12,marginBottom:14,flexWrap:'wrap'}}>
                  {Object.entries(LEVELS).map(([key,cfg]) => {
                    const isOn = level===key
                    return <button key={key} style={{...sy.lvBtn,...(isOn?{background:cfg.gradient,color:'#fff',border:'2px solid transparent',transform:'translateY(-3px)',boxShadow:'0 8px 24px '+cfg.color+'44'}:{})}} onClick={() => setLevel(key)}><span style={{fontSize:26}}>{cfg.emoji}</span><span style={{fontSize:14,fontWeight:700,color:isOn?'#fff':'#111827'}}>{cfg.label}</span><span style={{fontSize:11,color:isOn?'rgba(255,255,255,.8)':'#9CA3AF'}}>{cfg.age}</span></button>
                  })}
                </div>
                <div style={{...sy.levelDesc,borderColor:lv.color+'33',background:lv.bg}}>
                  <span style={{fontSize:20}}>{lv.emoji}</span>
                  <div><div style={{fontSize:13,fontWeight:700,color:lv.color}}>{lv.label} ({lv.age})</div><div style={{fontSize:12,color:'#6B7280',marginTop:2}}>{level==='children'&&'쉬운 비유·활동 중심, 핵심 1~2가지'}{level==='youth'&&'공감 스토리·도전 중심, 주간 과제 포함'}{level==='adult'&&'신학적 깊이·원어 분석, 설교 제목 3가지'}</div>{activeLibObj&&<div style={{fontSize:12,color:'#1D4ED8',marginTop:4,fontWeight:600}}>🎨 {activeLibObj.name} 스타일 반영</div>}</div>
                </div>
                <button style={{...sy.genBtn,opacity:sLoading?.7:1,background:lv.gradient}} onClick={genSermon} disabled={sLoading}>
                  {sLoading?<span style={{display:'flex',alignItems:'center',gap:8}}><div style={sy.spinSm}/>설교 작성 중...</span>:<span>{lv.emoji} {lv.label} 설교 생성하기</span>}
                </button>
              </div>
            )}

            {(sLoading||sermonOut)&&(
              <div style={{...sy.resultCard,borderColor:lv.border,marginBottom:16}}>
                <div style={{...sy.resultHead,background:lv.gradient}}>
                  <span style={{fontSize:22}}>{lv.emoji}</span>
                  <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:'#fff',fontFamily:"'Noto Serif KR',serif"}}>{lv.label} 설교 자료</div><div style={{fontSize:12,color:'rgba(255,255,255,.75)',marginTop:2}}>{refLabel} · {activeLibObj?activeLibObj.name+' 스타일':'Claude AI'}</div></div>
                  {!sLoading&&sermonOut&&<button style={sy.saveBtn} onClick={openSaveModal}>💾 저장하기</button>}
                </div>
                <div style={{...sy.resultBody,background:lv.bg}}>
                  {sLoading?<div style={sy.loadBox}><div style={sy.spinLg}/><p style={sy.loadTxt}>✍️ {lv.label} 맞춤 설교를 작성하고 있습니다...</p><p style={sy.loadSub}>성경 원문을 분석하여 구조화된 설교를 준비 중입니다</p></div>:<div>{renderMd(sermonOut)}</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {mainTab==='saved'&&(
          <div>
            <div style={sy.card}>
              <div style={{fontSize:15,fontWeight:700,color:'#111827',fontFamily:"'Noto Serif KR',serif",marginBottom:12}}>💾 저장된 설교 ({savedSermons.length}편)</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <input style={{...sy.nameInput,flex:2,minWidth:180}} placeholder='🔍 제목, 구절, 내용으로 검색...' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
                <select style={{...sy.sel,flex:1,minWidth:120}} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                  <option value='all'>전체 대상</option><option value='children'>🌱 유치부</option><option value='youth'>🔥 청소년부</option><option value='adult'>✝️ 성인부</option>
                </select>
              </div>
            </div>
            {savedSermons.length===0?<div style={sy.emptyBox}><div style={{fontSize:40,marginBottom:12}}>💾</div><p style={{color:'#6B7280',fontSize:14}}>아직 저장된 설교가 없습니다.</p><button style={{...sy.smallBtn2,marginTop:14}} onClick={() => setMainTab('bible')}>설교 생성하러 가기 →</button></div>
            :filteredSermons.length===0?<div style={sy.emptyBox}><p style={{color:'#9CA3AF',fontSize:13}}>검색 결과가 없습니다.</p></div>
            :<div>{filteredSermons.map(s => {
              const sLv = LEVELS[s.level]
              return <div key={s.id} style={sy.sermonCard}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 18px'}}>
                  <div style={{...sy.levelDot,background:sLv.gradient}}>{sLv.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,color:'#111827',marginBottom:3}}>{s.title}</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',marginBottom:4}}><span style={{...sy.tagChip,background:sLv.bg,color:sLv.color,border:'1px solid '+sLv.border}}>{sLv.label}</span><span style={sy.tagChip2}>{s.refLabel}</span>{s.styleName&&<span style={sy.tagChip3}>🎨 {s.styleName}</span>}</div>
                    <div style={{fontSize:11,color:'#9CA3AF'}}>📅 {s.date} {s.time}</div>
                    <p style={{fontSize:12,color:'#6B7280',marginTop:6,lineHeight:1.5,overflow:'hidden',maxHeight:34}}>{s.content.replace(/[#*]/g,'').slice(0,90)}...</p>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
                    <button style={sy.viewBtn} onClick={() => setViewSermon(s)}>📖 열람</button>
                    <button style={sy.delBtnSm} onClick={() => setDeleteConfirm(s.id)}>🗑️ 삭제</button>
                  </div>
                </div>
                {deleteConfirm===s.id&&<div style={sy.confirmBox}><p style={{fontSize:13,color:'#374151',marginBottom:10}}>이 설교를 삭제하시겠습니까?</p><div style={{display:'flex',gap:8}}><button style={sy.modalCancelBtn} onClick={() => setDeleteConfirm(null)}>취소</button><button style={{...sy.modalSaveBtn,background:'linear-gradient(135deg,#DC2626,#B91C1C)'}} onClick={() => deleteSermon(s.id)}>삭제</button></div></div>}
              </div>
            })}</div>}
          </div>
        )}

        {mainTab==='library'&&(
          <div>
            <div style={sy.card}>
              <span style={sy.badge}>설교 파일 업로드</span>
              <div style={sy.cardTitle}>📤 나의 설교 스타일 등록</div>
              <p style={{fontSize:13,color:'#6B7280',marginBottom:16,lineHeight:1.7}}>설교 원고를 업로드하면 AI가 목사님의 고유한 설교 스타일을 분석합니다.<br/><b>(pdf · docx · txt)</b></p>
              <div style={{marginBottom:12}}><div style={sy.selLabel}>📛 스타일 이름</div><input style={sy.nameInput} placeholder='예: 홍길동 목사 설교 스타일' value={upName} onChange={e => setUpName(e.target.value)}/></div>
              <div style={{marginBottom:12}}>
                <div style={sy.selLabel}>📁 파일 선택</div>
                <div style={sy.dropArea} onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type='file' accept='.pdf,.docx,.txt' multiple style={{display:'none'}} onChange={e => setUpFiles(Array.from(e.target.files))}/>
                  {upFiles.length===0?<div style={{textAlign:'center'}}><div style={{fontSize:32,marginBottom:8}}>📂</div><p style={{fontSize:14,color:'#6B7280'}}>클릭하여 파일 선택</p><p style={{fontSize:12,color:'#9CA3AF',marginTop:4}}>PDF · DOCX · TXT 지원</p></div>:<div style={{width:'100%'}}>{upFiles.map((f,i)=><div key={i} style={sy.fileItem}><span style={{fontSize:16}}>{f.name.endsWith('.pdf')?'📄':f.name.endsWith('.docx')?'📝':'📃'}</span><span style={{fontSize:13,color:'#374151',flex:1}}>{f.name}</span><span style={{fontSize:11,color:'#9CA3AF'}}>{(f.size/1024).toFixed(0)}KB</span></div>)}<p style={{fontSize:12,color:'#6B7280',marginTop:8,textAlign:'center'}}>클릭하여 파일 변경</p></div>}
                </div>
              </div>
              {upError&&<p style={{color:'#DC2626',fontSize:13,marginBottom:8}}>⚠️ {upError}</p>}
              {upProgress&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'#EFF6FF',borderRadius:10,marginBottom:10}}><div style={sy.spinSm2}/><span style={{fontSize:13,color:'#1D4ED8'}}>{upProgress}</span></div>}
              <button style={{...sy.genBtn,background:'linear-gradient(135deg,#1D4ED8,#4F46E5)',opacity:upLoading?.7:1,marginTop:4}} onClick={handleUpload} disabled={upLoading}>{upLoading?<span style={{display:'flex',alignItems:'center',gap:8}}><div style={sy.spinSm}/>분석 중...</span>:<span>🔍 업로드 및 스타일 분석</span>}</button>
            </div>
            {library.length===0?<div style={sy.emptyBox}><div style={{fontSize:40,marginBottom:12}}>📚</div><p style={{color:'#6B7280',fontSize:14}}>등록된 스타일이 없습니다.</p></div>
            :<div><div style={{fontSize:13,fontWeight:700,color:'#CBD5E1',marginBottom:10}}>저장된 스타일 ({library.length}개)</div>
              {library.map(lib => {
                const isActive = activeLib===lib.id
                return <div key={lib.id} style={{...sy.libCard,...(isActive?sy.libCardOn:{})}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 18px'}}>
                    <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:'#111827'}}>{lib.name}</div><div style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>{lib.date} · 파일 {lib.fileCount}개</div></div>
                    <div style={{display:'flex',gap:8}}><button style={{...sy.useBtn,...(isActive?sy.useBtnOn:{})}} onClick={() => {if(isActive)setActiveLib(null);else{setActiveLib(lib.id);setMainTab('bible');}}}>{isActive?'✓ 사용 중':'사용하기'}</button><button style={sy.delBtnSm} onClick={() => deleteLib(lib.id)}>🗑️</button></div>
                  </div>
                  {lib.analysis&&<div style={sy.analysisBox}>
                    {[['설교 스타일',lib.analysis.preachingStyle],['언어 톤',lib.analysis.toneAndVoice],['구조 패턴',lib.analysis.structurePattern],['신학 강조',lib.analysis.theologicalEmphasis],['자주 쓰는 표현',lib.analysis.keyPhrases]].map((row,ri)=><div key={ri} style={sy.aRow}><span style={sy.aLabel}>{row[0]}</span><span style={sy.aVal}>{row[1]}</span></div>)}
                    <div style={{...sy.aRow,borderBottom:'none'}}><span style={sy.aLabel}>종합 요약</span><span style={{...sy.aVal,color:'#1D4ED8',fontWeight:600}}>{lib.analysis.summary}</span></div>
                  </div>}
                </div>
              })}
            </div>}
          </div>
        )}

        <p style={{textAlign:'center',color:'#475569',fontSize:11,paddingBottom:8,marginTop:8}}>설교 비서 · Powered by Claude AI · 개역개정 + KJV ✝️</p>
      </div>

      {showSaveModal&&<div style={sy.modalOverlay}><div style={sy.modal}><div style={sy.modalTitle}>💾 설교 저장하기</div><p style={{fontSize:13,color:'#6B7280',marginBottom:16}}>{refLabel} · {LEVELS[level].label}</p><div style={sy.selLabel}>설교 제목</div><input style={{...sy.nameInput,marginBottom:8}} value={saveTitle} onChange={e => setSaveTitle(e.target.value)} placeholder='저장할 설교 제목을 입력하세요'/>{saveMsg&&<p style={{color:'#DC2626',fontSize:12,marginBottom:8}}>⚠️ {saveMsg}</p>}<div style={{display:'flex',gap:10,marginTop:8}}><button style={sy.modalCancelBtn} onClick={() => setShowSaveModal(false)}>취소</button><button style={sy.modalSaveBtn} onClick={saveSermon}>💾 저장</button></div></div></div>}
    </div>
  )
}

const sy = {
  root:{minHeight:'100vh',background:'linear-gradient(160deg,#0B1426 0%,#162040 45%,#0F172A 100%)',fontFamily:"'Noto Sans KR',sans-serif",padding:'28px 16px 48px',position:'relative',overflow:'hidden'},
  orb1:{position:'fixed',top:'-120px',right:'-120px',width:480,height:480,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,.14) 0%,transparent 70%)',pointerEvents:'none'},
  orb2:{position:'fixed',bottom:'-160px',left:'-120px',width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.11) 0%,transparent 70%)',pointerEvents:'none'},
  wrap:{maxWidth:780,margin:'0 auto',position:'relative',zIndex:1},
  hdr:{textAlign:'center',marginBottom:20},
  cross:{fontSize:42,color:'#93C5FD',display:'block',fontFamily:'serif',marginBottom:4},
  title:{fontFamily:"'Noto Serif KR',serif",fontSize:32,fontWeight:700,color:'#F0F9FF',letterSpacing:'-0.5px',marginBottom:6},
  sub:{color:'#94A3B8',fontSize:13},
  saveBar:{marginTop:8,padding:'6px 16px',borderRadius:20,background:'rgba(30,58,138,.8)',color:'#93C5FD',fontSize:12,fontWeight:600,display:'inline-block'},
  mainTab:{flex:1,padding:'11px 6px',borderRadius:12,border:'2px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.07)',color:'#94A3B8',fontSize:12,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif",position:'relative'},
  mainTabOn:{background:'rgba(255,255,255,.97)',color:'#111827',border:'2px solid transparent',boxShadow:'0 4px 20px rgba(0,0,0,.25)'},
  tabBadge:{position:'absolute',top:-6,right:-6,background:'#EF4444',color:'#fff',fontSize:10,fontWeight:700,width:18,height:18,borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'},
  styleBanner:{background:'rgba(255,255,255,.97)',borderRadius:14,padding:'12px 16px',marginBottom:10,border:'2px solid #BFDBFE',display:'flex',alignItems:'center',gap:12},
  card:{background:'rgba(255,255,255,.97)',borderRadius:20,padding:'22px',marginBottom:12,boxShadow:'0 18px 56px rgba(0,0,0,.32)'},
  badge:{display:'inline-block',background:'linear-gradient(135deg,#1D4ED8,#4F46E5)',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:2,padding:'3px 10px',borderRadius:20,marginBottom:10},
  cardTitle:{fontSize:15,fontWeight:700,color:'#111827',marginBottom:14,fontFamily:"'Noto Serif KR',serif"},
  dim:{fontSize:12,fontWeight:400,color:'#9CA3AF'},
  selLabel:{fontSize:12,fontWeight:600,color:'#6B7280',marginBottom:5},
  sel:{width:'100%',padding:'10px 12px',borderRadius:10,border:'1.5px solid #E5E7EB',fontSize:14,color:'#111827',background:'#F9FAFB',fontFamily:"'Noto Sans KR',sans-serif"},
  infoTag:{marginTop:10,padding:'8px 14px',background:'#EFF6FF',border:'1.5px solid #BFDBFE',borderRadius:10,fontSize:13,color:'#1D4ED8'},
  hint:{marginTop:10,padding:'8px 14px',background:'#FFFBEB',border:'1.5px solid #FDE68A',borderRadius:10,fontSize:12,color:'#92400E'},
  rangeWrap:{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'},
  rangeGroup:{flex:1,minWidth:180,background:'#F8FAFC',border:'1.5px solid #E5E7EB',borderRadius:14,padding:'12px 14px'},
  rangeLabel:{fontSize:12,fontWeight:700,color:'#374151',marginBottom:10},
  arrow:{fontSize:22,color:'#9CA3AF',fontWeight:700,userSelect:'none',flexShrink:0,alignSelf:'center',marginTop:10},
  verseCard:{background:'rgba(255,255,255,.97)',borderRadius:20,overflow:'hidden',border:'2px solid #DBEAFE',marginBottom:12,boxShadow:'0 18px 56px rgba(0,0,0,.32)'},
  verseHead:{background:'linear-gradient(135deg,#1E3A8A,#1D4ED8)',padding:'12px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8},
  verseRef:{color:'#fff',fontFamily:"'Noto Serif KR',serif",fontSize:15,fontWeight:700},
  kjvBadge:{background:'rgba(255,255,255,.2)',color:'#fff',fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:600},
  langBtn:{padding:'3px 10px',borderRadius:20,border:'1.5px solid rgba(255,255,255,.35)',background:'transparent',color:'rgba(255,255,255,.65)',fontSize:11,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif"},
  langBtnOn:{background:'rgba(255,255,255,.25)',color:'#fff',border:'1.5px solid rgba(255,255,255,.8)'},
  badgeKor:{display:'inline-block',background:'#FFF1F2',border:'1px solid #FECDD3',color:'#BE123C',fontSize:11,fontWeight:700,padding:'2px 10px',borderRadius:20,marginBottom:6},
  badgeEng:{display:'inline-block',background:'#EFF6FF',border:'1px solid #BFDBFE',color:'#1D4ED8',fontSize:11,fontWeight:700,padding:'2px 10px',borderRadius:20,marginBottom:6},
  themeBadge:{padding:'3px 10px',background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:20,fontSize:11,color:'#1D4ED8',fontWeight:600},
  lvBtn:{flex:1,minWidth:120,padding:'15px 10px',background:'#F9FAFB',border:'2px solid #E5E7EB',borderRadius:14,display:'flex',flexDirection:'column',alignItems:'center',gap:3,fontFamily:"'Noto Sans KR',sans-serif",boxShadow:'0 3px 10px rgba(0,0,0,.07)'},
  levelDesc:{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',borderRadius:12,border:'1.5px solid',marginBottom:14},
  genBtn:{width:'100%',padding:'14px',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 14px rgba(0,0,0,.2)'},
  saveBtn:{padding:'8px 16px',borderRadius:20,border:'2px solid rgba(255,255,255,.5)',background:'rgba(255,255,255,.15)',color:'#fff',fontSize:13,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif",flexShrink:0},
  resultCard:{borderRadius:20,border:'2px solid',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.32)'},
  resultHead:{padding:'14px 22px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'},
  resultBody:{padding:'22px'},
  loadBox:{textAlign:'center',padding:'44px 0'},
  loadTxt:{color:'#374151',fontSize:15,fontWeight:600,marginBottom:6},
  loadSub:{color:'#9CA3AF',fontSize:13},
  sermonCard:{background:'rgba(255,255,255,.97)',borderRadius:16,marginBottom:10,boxShadow:'0 6px 24px rgba(0,0,0,.18)',overflow:'hidden'},
  levelDot:{width:40,height:40,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0},
  tagChip:{fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:20},
  tagChip2:{fontSize:11,color:'#6B7280',padding:'2px 8px',background:'#F1F5F9',borderRadius:20},
  tagChip3:{fontSize:11,color:'#7C3AED',padding:'2px 8px',background:'#F5F3FF',borderRadius:20},
  viewBtn:{padding:'6px 12px',borderRadius:10,border:'1.5px solid #BFDBFE',background:'#EFF6FF',color:'#1D4ED8',fontSize:12,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif"},
  delBtnSm:{padding:'6px 10px',borderRadius:10,border:'1.5px solid #FEE2E2',background:'#FFF5F5',color:'#EF4444',fontSize:12,fontFamily:"'Noto Sans KR',sans-serif"},
  confirmBox:{background:'#FFF5F5',borderTop:'1px solid #FEE2E2',padding:'14px 18px'},
  emptyBox:{textAlign:'center',padding:'48px 24px',background:'rgba(255,255,255,.06)',borderRadius:20,border:'1px dashed rgba(255,255,255,.15)'},
  nameInput:{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #E5E7EB',fontSize:14,color:'#111827',background:'#F9FAFB',fontFamily:"'Noto Sans KR',sans-serif"},
  dropArea:{border:'2px dashed #BFDBFE',borderRadius:14,padding:'24px',textAlign:'center',cursor:'pointer',background:'#F8FAFF',minHeight:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'},
  fileItem:{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'#EFF6FF',borderRadius:8,marginBottom:6},
  libCard:{background:'rgba(255,255,255,.97)',borderRadius:16,marginBottom:12,overflow:'hidden',boxShadow:'0 8px 30px rgba(0,0,0,.2)',border:'2px solid transparent'},
  libCardOn:{border:'2px solid #3B82F6',boxShadow:'0 8px 30px rgba(59,130,246,.25)'},
  useBtn:{padding:'6px 14px',borderRadius:20,border:'1.5px solid #E5E7EB',background:'#F9FAFB',color:'#6B7280',fontSize:12,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif"},
  useBtnOn:{background:'linear-gradient(135deg,#1D4ED8,#4F46E5)',color:'#fff',border:'1.5px solid transparent'},
  analysisBox:{background:'#F8FAFF',borderTop:'1px solid #E5E7EB',padding:'14px 18px'},
  aRow:{display:'flex',gap:10,padding:'6px 0',borderBottom:'1px solid #F1F5F9',flexWrap:'wrap'},
  aLabel:{fontSize:11,fontWeight:700,color:'#6B7280',minWidth:90,flexShrink:0},
  aVal:{fontSize:12,color:'#374151',lineHeight:1.6,flex:1},
  smallBtn:{padding:'4px 10px',borderRadius:20,border:'1px solid #E5E7EB',background:'#F9FAFB',color:'#6B7280',fontSize:12,fontFamily:"'Noto Sans KR',sans-serif"},
  smallBtn2:{padding:'6px 16px',borderRadius:20,border:'1px solid #D97706',background:'transparent',color:'#D97706',fontSize:12,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif"},
  backBtn:{padding:'8px 16px',borderRadius:20,border:'2px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#E2E8F0',fontSize:13,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif"},
  modalOverlay:{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:16},
  modal:{background:'#fff',borderRadius:20,padding:'28px 24px',width:'100%',maxWidth:420,boxShadow:'0 24px 64px rgba(0,0,0,.4)'},
  modalTitle:{fontSize:18,fontWeight:700,color:'#111827',marginBottom:8,fontFamily:"'Noto Serif KR',serif"},
  modalCancelBtn:{flex:1,padding:'12px',borderRadius:10,border:'1.5px solid #E5E7EB',background:'#F9FAFB',color:'#6B7280',fontSize:14,fontWeight:600,fontFamily:"'Noto Sans KR',sans-serif"},
  modalSaveBtn:{flex:1,padding:'12px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#1D4ED8,#4F46E5)',color:'#fff',fontSize:14,fontWeight:700,fontFamily:"'Noto Sans KR',sans-serif"},
  spin:{width:20,height:20,border:'2px solid #E5E7EB',borderTop:'2px solid #1D4ED8',borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0},
  spinSm:{width:15,height:15,border:'2px solid rgba(255,255,255,.4)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin .7s linear infinite'},
  spinSm2:{width:16,height:16,border:'2px solid #BFDBFE',borderTop:'2px solid #1D4ED8',borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0},
  spinLg:{width:42,height:42,border:'3px solid #E5E7EB',borderTop:'3px solid #1D4ED8',borderRadius:'50%',animation:'spin .8s linear infinite',margin:'0 auto 16px'},
  h2:{fontFamily:"'Noto Serif KR',serif",fontSize:16,fontWeight:700,color:'#111827',marginTop:20,marginBottom:8,paddingBottom:5,borderBottom:'2px solid #E5E7EB'},
  h3:{fontFamily:"'Noto Serif KR',serif",fontSize:14,fontWeight:600,color:'#374151',marginTop:13,marginBottom:4},
  para:{color:'#374151',fontSize:14,marginBottom:3,lineHeight:1.85},
  li:{color:'#374151',fontSize:14,marginBottom:3,paddingLeft:8,lineHeight:1.85},
  bullet:{color:'#374151',fontSize:14,marginBottom:3,paddingLeft:12,lineHeight:1.85},
}
