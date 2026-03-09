import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { Linkedin, Twitter, Youtube } from 'lucide-react'

// ——— Motion tokens ———
const EASE = {
  out:    [0.25, 0.1, 0.25, 1],
  enter:  [0.0,  0.0, 0.2,  1],
  exit:   [0.4,  0.0, 1.0,  1],
  spring: { type: 'spring', stiffness: 400, damping: 35 },
  snap:   { type: 'spring', stiffness: 600, damping: 30 },
  slow:   [0.4,  0.0, 0.2,  1],
}
const DUR = { instant: 0.10, fast: 0.20, normal: 0.35, slow: 0.50, cinematic: 0.80 }
const STAGGER = { tight: 0.06, normal: 0.10, loose: 0.15, wide: 0.20 }

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.normal } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE.out } },
}
const primaryBtn = {
  whileHover: { scale: 1.02, boxShadow: '0 6px 24px rgba(108,71,255,0.28)' },
  whileTap:   { scale: 0.98 },
  transition: EASE.snap,
}
const ghostBtn = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: EASE.snap }
const card = {
  whileHover: { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.10)', borderColor: 'rgba(108,71,255,0.2)' },
  transition: { duration: DUR.fast, ease: EASE.out },
}
const swap = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 24 : -24, filter: 'blur(4px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: DUR.normal, ease: EASE.enter } },
  exit:   (d) => ({ opacity: 0, x: d > 0 ? -24 : 24, filter: 'blur(4px)', transition: { duration: DUR.fast, ease: EASE.exit } }),
}
const livePulse = { animate: { opacity: [1, 0.3, 1], scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity } }
const cursorBlink = { animate: { opacity: [1, 0, 1] }, transition: { duration: 1, repeat: Infinity, ease: 'steps(1)' } }
const float = { animate: { y: [0, -6, 0] }, transition: { duration: 4, repeat: Infinity, ease: EASE.slow } }
const agentPop = { initial: { scale: 0, opacity: 0, y: 8 }, animate: { scale: 1, opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 500, damping: 28 } }
const chipFlip = { initial: { scale: 0.85, opacity: 0 }, animate: { scale: [0.85, 1.1, 1.0], opacity: 1 }, transition: { duration: 0.3, ease: EASE.snap } }

function useCountUp(target, duration = 1500, inView) {
  const [n, setN] = useState(target)
  useEffect(() => {
    if (!inView) return
    setN(0)
    let val = 0
    const step = target / (duration / 16)
    const t = setInterval(() => {
      val += step
      if (val >= target) { setN(target); clearInterval(t); return }
      setN(Math.floor(val))
    }, 16)
    return () => clearInterval(t)
  }, [inView, target, duration])
  return n
}

function SectionLabel({ n }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-xmuted)', marginBottom: 24, opacity: 0.85 }}>
      [{String(n).padStart(2, '0')} / 12]
    </div>
  )
}

function Eyebrow({ children, dark }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'var(--primary)', opacity: 0.95 }}>
      {children}
    </div>
  )
}

function Toggle({ on, toggle }) {
  return (
    <motion.div
      onClick={toggle}
      animate={{ background: on ? 'var(--primary)' : 'rgba(0,0,0,0.15)' }}
      transition={{ duration: DUR.fast }}
      style={{ width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer', flexShrink: 0 }}
    >
      <motion.div
        animate={{ left: on ? 23 : 3 }}
        transition={EASE.snap}
        style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white' }}
      />
    </motion.div>
  )
}

const NAV_LINKS = ['Product', 'Solutions', 'Pricing', 'Enterprise']
const MARQUEE_LOGOS = ['Uber', 'Coca-Cola', 'Canva', 'Hulu', 'Lionsgate', 'NBC', 'Universal', 'Unilever']

const STATUS_COLORS = {
  'Done': '#00C875',
  'Working on it': '#FDAB3D',
  'Stuck': '#E2445C',
  'Not started': '#C4C4C4',
  'In review': '#784BD1',
  'Waiting': '#579BFC',
}

const BOARD_DATA = {
  Marketing: {
    name: 'Q3 Campaign Launch',
    groups: [
      { name: 'Planning', color: '#579BFC', items: [
        { name: 'Campaign brief', owner: 'AL', ownerColor: '#A25DDC', status: 'Done', date: 'Oct 3' },
        { name: 'Audience research', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 5' },
        { name: 'Budget approval', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 8' },
      ]},
      { name: 'Creative', color: '#A25DDC', items: [
        { name: 'Homepage mockup', owner: 'AL', ownerColor: '#A25DDC', status: 'Working on it', date: 'Oct 14' },
        { name: 'Ad creative set', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Oct 17' },
        { name: 'Copy deck', owner: 'SR', ownerColor: '#579BFC', status: 'In review', date: 'Oct 12' },
      ]},
      { name: 'Launch', color: '#00C875', items: [
        { name: 'Stakeholder sign-off', owner: 'MK', ownerColor: '#00C875', status: 'Stuck', date: 'Oct 16' },
        { name: 'Publish to channels', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Oct 21' },
      ]},
    ],
  },
  PMO: {
    name: 'Portfolio Overview — Q4',
    groups: [
      { name: 'Strategic Initiatives', color: '#579BFC', items: [
        { name: 'AI platform launch', owner: 'DW', ownerColor: '#579BFC', status: 'Working on it', date: 'Nov 1' },
        { name: 'Global rebrand', owner: 'AL', ownerColor: '#A25DDC', status: 'In review', date: 'Nov 15' },
        { name: 'ERP migration', owner: 'MK', ownerColor: '#00C875', status: 'Stuck', date: 'Oct 30' },
      ]},
      { name: 'On Track', color: '#00C875', items: [
        { name: 'Q4 sales training', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 10' },
        { name: 'Security audit', owner: 'JL', ownerColor: '#FDAB3D', status: 'Working on it', date: 'Oct 25' },
      ]},
    ],
  },
  HR: {
    name: 'New Hire Onboarding',
    groups: [
      { name: 'Week 1 Tasks', color: '#00C875', items: [
        { name: 'Send offer letter', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 1' },
        { name: 'IT equipment setup', owner: 'JL', ownerColor: '#FDAB3D', status: 'Done', date: 'Oct 2' },
        { name: 'Slack & tools access', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 3' },
        { name: 'Manager intro call', owner: 'AL', ownerColor: '#A25DDC', status: 'Not started', date: 'Oct 4' },
      ]},
      { name: 'Week 2–4', color: '#FDAB3D', items: [
        { name: 'Role training plan', owner: 'SR', ownerColor: '#579BFC', status: 'Not started', date: 'Oct 8' },
        { name: '30-day check-in', owner: 'AL', ownerColor: '#A25DDC', status: 'Not started', date: 'Oct 28' },
      ]},
    ],
  },
  Product: {
    name: 'Product Roadmap — Q4',
    groups: [
      { name: 'In Progress', color: '#579BFC', items: [
        { name: 'AI agent builder', owner: 'DW', ownerColor: '#579BFC', status: 'Working on it', date: 'Oct 20' },
        { name: 'Mobile redesign', owner: 'AL', ownerColor: '#A25DDC', status: 'In review', date: 'Oct 18' },
        { name: 'API v3 release', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 25' },
      ]},
      { name: 'Backlog', color: '#C4C4C4', items: [
        { name: 'Gantt improvements', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Nov 5' },
        { name: 'Dashboard templates', owner: 'SR', ownerColor: '#579BFC', status: 'Not started', date: 'Nov 12' },
      ]},
    ],
  },
  Legal: {
    name: 'Contract Management',
    groups: [
      { name: 'Pending Review', color: '#FDAB3D', items: [
        { name: 'Vendor MSA — Acme', owner: 'SR', ownerColor: '#579BFC', status: 'In review', date: 'Oct 9' },
        { name: 'Enterprise SLA draft', owner: 'AL', ownerColor: '#A25DDC', status: 'Working on it', date: 'Oct 11' },
        { name: 'NDA — Global Corp', owner: 'MK', ownerColor: '#00C875', status: 'Waiting', date: 'Oct 13' },
      ]},
      { name: 'Approved', color: '#00C875', items: [
        { name: 'Partner agreement', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 2' },
        { name: 'Q3 renewal — TechCo', owner: 'JL', ownerColor: '#FDAB3D', status: 'Done', date: 'Sep 28' },
      ]},
    ],
  },
  IT: {
    name: 'IT Support Tickets',
    groups: [
      { name: 'Open', color: '#E2445C', items: [
        { name: 'VPN access — new hire', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 7' },
        { name: 'Laptop issue — Desk 4', owner: 'JL', ownerColor: '#FDAB3D', status: 'Stuck', date: 'Oct 6' },
        { name: 'Email migration — EU', owner: 'DW', ownerColor: '#579BFC', status: 'Working on it', date: 'Oct 10' },
      ]},
      { name: 'Resolved', color: '#00C875', items: [
        { name: 'Password reset — AL', owner: 'MK', ownerColor: '#00C875', status: 'Done', date: 'Oct 5' },
        { name: 'Monitor setup — #12', owner: 'JL', ownerColor: '#FDAB3D', status: 'Done', date: 'Oct 4' },
      ]},
    ],
  },
  Operations: {
    name: 'Cross-Functional Workflows',
    groups: [
      { name: 'Active', color: '#579BFC', items: [
        { name: 'Office expansion plan', owner: 'AL', ownerColor: '#A25DDC', status: 'Working on it', date: 'Oct 22' },
        { name: 'Vendor renewal cycle', owner: 'SR', ownerColor: '#579BFC', status: 'In review', date: 'Oct 17' },
        { name: 'Process audit — Ops', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 19' },
      ]},
      { name: 'Blocked', color: '#E2445C', items: [
        { name: 'Budget reforecast', owner: 'DW', ownerColor: '#579BFC', status: 'Stuck', date: 'Oct 14' },
      ]},
    ],
  },
}

const DEPT_DATA = [
  { name: 'PMO', description: 'Align every project to strategic goals with AI-powered planning and executive-ready visibility.', actions: ['Builds portfolio plan from strategic goals', 'Flags at-risk projects automatically', 'Reallocates budget across teams'] },
  { name: 'Legal', description: 'Command contracts and compliance with a governed platform that executes reviews with precision.', actions: ['Routes contracts to the right reviewer', 'Tracks clause approvals in sequence', 'Flags compliance risk before signing'] },
  { name: 'HR', description: 'Transform people processes into automated workflows that retain institutional knowledge as your team grows.', actions: ['Runs onboarding workflows automatically', 'Routes approvals to the right manager', 'Captures institutional knowledge'] },
  { name: 'Product', description: 'Ship with confidence using roadmaps, sprint boards, and AI prioritization aligned to your strategy.', actions: ['Prioritizes backlog by impact and effort', 'Updates sprint board as work moves', 'Flags scope creep before it affects delivery'] },
  { name: 'Marketing', description: 'Scale creative output without increasing headcount using agents that execute within your brand context.', actions: ['Drafts campaign briefs from a prompt', 'Generates and routes assets for approval', 'Publishes to channels on schedule'] },
  { name: 'IT', description: 'Streamline tickets and incidents with automated routing and real-time SLA tracking.', actions: ['Triages and routes tickets to the right owner', 'Monitors SLA timers and escalates before breach', 'Closes the loop automatically'] },
  { name: 'Operations', description: 'Orchestrate cross-functional workflows with smart automations, approvals, and dashboards that reflect reality.', actions: ['Triggers cross-team workflows from one event', 'Tracks dependencies across departments', 'Escalates blockers before they compound'] },
]

function MondayBoardMockup({ department = 'Marketing', statusDoneCount }) {
  const boardData = BOARD_DATA[department] || BOARD_DATA['Marketing']
  let flatIndex = 0
  const getStatus = (item) => {
    if (statusDoneCount != null && flatIndex < statusDoneCount) {
      flatIndex++
      return 'Done'
    }
    flatIndex++
    return item.status
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: 'Poppins' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
        <div style={{ borderBottom: '1px solid #E6E9EF', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{boardData.name}</div>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E6E9EF', marginBottom: -13 }}>
            {['Main Table', 'Kanban', 'Gantt', 'Calendar'].map((view, i) => (
              <div key={view} style={{ padding: '6px 16px', fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--primary)' : '#676879', borderBottom: i === 0 ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer' }}>{view}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '8px 24px', borderBottom: '1px solid #E6E9EF', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>+ New item</div>
          {['Search', 'Filter', 'Group by', 'Columns'].map(action => (
            <div key={action} style={{ fontSize: 13, color: '#676879', cursor: 'pointer' }}>{action}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 160px 100px', background: '#F5F6F8', borderBottom: '1px solid #E6E9EF', padding: '0 24px' }}>
          {['', 'Item', 'Owner', 'Status', 'Due Date'].map((col, i) => (
            <div key={i} style={{ padding: '10px 8px', fontSize: 12, fontWeight: 500, color: '#676879', borderRight: i < 4 ? '1px solid #E6E9EF' : 'none' }}>{col}</div>
          ))}
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {boardData.groups.map((group, gi) => (
            <div key={gi}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 24px', background: '#F5F6F8', borderLeft: `4px solid ${group.color}`, borderBottom: '1px solid #E6E9EF' }}>
                <span style={{ fontSize: 12 }}>▾</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{group.name}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#676879', background: '#E6E9EF', padding: '1px 7px', borderRadius: 100 }}>{group.items.length}</span>
              </div>
              {group.items.map((item, ii) => {
                const status = getStatus(item)
                const bgColor = STATUS_COLORS[status] || STATUS_COLORS['Not started']
                return (
                  <div key={ii} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 160px 100px', borderLeft: `4px solid ${group.color}`, borderBottom: '1px solid #E6E9EF', background: ii % 2 === 0 ? 'white' : '#FAFBFF', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #E6E9EF', padding: '0 8px' }}>
                      <div style={{ width: 14, height: 14, border: '1.5px solid #C4C4C4', borderRadius: 3 }} />
                    </div>
                    <div style={{ padding: '11px 8px', fontSize: 13, fontWeight: 400, borderRight: '1px solid #E6E9EF' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #E6E9EF' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: item.ownerColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700 }}>{item.owner}</div>
                    </div>
                    <div style={{ background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #E6E9EF' }}>
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 12, color: '#676879' }}>{item.date}</div>
                  </div>
                )
              })}
              <div style={{ padding: '8px 24px 8px 68px', fontSize: 13, color: '#676879', cursor: 'pointer', borderLeft: `4px solid ${group.color}`, borderBottom: '1px solid #E6E9EF' }}>+ Add item</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MondayBoardSurface({ boardName = 'Q3 Campaign Launch', groups }) {
  const defaultGroups = [
    { name: 'Planning', color: '#579BFC', items: [
      { name: 'Campaign brief', owner: 'AL', ownerColor: '#A25DDC', status: 'Done', date: 'Oct 3' },
      { name: 'Audience research', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 5' },
      { name: 'Budget approval', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 8' },
    ]},
    { name: 'Creative', color: '#A25DDC', items: [
      { name: 'Homepage mockup', owner: 'AL', ownerColor: '#A25DDC', status: 'Working on it', date: 'Oct 14' },
      { name: 'Ad creative set', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Oct 17' },
      { name: 'Copy deck', owner: 'SR', ownerColor: '#579BFC', status: 'In review', date: 'Oct 12' },
    ]},
    { name: 'Launch', color: '#00C875', items: [
      { name: 'Stakeholder sign-off', owner: 'MK', ownerColor: '#00C875', status: 'Stuck', date: 'Oct 16' },
      { name: 'Publish to channels', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Oct 21' },
    ]},
  ]
  const data = groups || defaultGroups
  const SURFACE_STATUS_COLORS = { 'Done': '#00C875', 'Working on it': '#FDAB3D', 'Stuck': '#E2445C', 'Not started': '#C4C4C4', 'In review': '#784BD1', 'Waiting': '#579BFC' }
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E6E9EF' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{boardName}</div>
          <div style={{ display: 'flex', gap: 0 }}>
            {['Main Table', 'Kanban', 'Gantt', 'Calendar'].map((v, i) => (
              <div key={v} style={{ padding: '5px 14px', fontSize: 12, color: i === 0 ? 'var(--primary)' : '#676879', fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer' }}>{v}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #E6E9EF', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>+ New item</div>
          {['Filter', 'Group by', 'Columns'].map(a => <div key={a} style={{ fontSize: 12, color: '#676879', cursor: 'pointer' }}>{a}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 90px 130px 80px', background: '#F5F6F8', borderBottom: '1px solid #E6E9EF', padding: '0 20px' }}>
          {['', 'Item', 'Owner', 'Status', 'Due'].map((col, i) => (
            <div key={i} style={{ padding: '8px 6px', fontSize: 11, fontWeight: 500, color: '#676879', borderRight: i < 4 ? '1px solid #E6E9EF' : 'none' }}>{col}</div>
          ))}
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {data.map((group, gi) => (
            <div key={gi}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 20px', background: '#F5F6F8', borderLeft: `4px solid ${group.color}`, borderBottom: '1px solid #E6E9EF' }}>
                <span style={{ fontSize: 11 }}>▾</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{group.name}</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#676879', background: '#E6E9EF', padding: '1px 6px', borderRadius: 100 }}>{group.items.length}</span>
              </div>
              {group.items.map((item, ii) => (
                <div key={ii} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 90px 130px 80px', borderLeft: `4px solid ${group.color}`, borderBottom: '1px solid #E6E9EF', background: ii % 2 === 0 ? 'white' : '#FAFBFF', padding: '0 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #E6E9EF', padding: '0 6px' }}>
                    <div style={{ width: 12, height: 12, border: '1.5px solid #C4C4C4', borderRadius: 2 }} />
                  </div>
                  <div style={{ padding: '10px 6px', fontSize: 12, borderRight: '1px solid #E6E9EF' }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #E6E9EF' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.ownerColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>{item.owner}</div>
                  </div>
                  <div style={{ background: SURFACE_STATUS_COLORS[item.status] || '#C4C4C4', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #E6E9EF' }}>
                    <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>{item.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', fontSize: 11, color: '#676879' }}>{item.date}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AgentSurface({ agentName, taskTitle, steps: agentSteps }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0)
  useEffect(() => {
    if (activeStepIdx >= agentSteps.length - 1) return
    const t = setTimeout(() => setActiveStepIdx((i) => i + 1), 1800)
    return () => clearTimeout(t)
  }, [activeStepIdx, agentSteps.length])
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ flex: 1, background: '#F7F7FB', padding: 24, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E9EF', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #6C47FF 0%, #A25DDC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>⚡</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{agentName}</div>
            <div style={{ fontSize: 12, color: '#676879' }}>AI Agent · monday work management</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,200,117,0.08)', border: '1px solid #00C875', padding: '5px 12px', borderRadius: 100 }}>
            <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C875' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#00C875' }}>Running</span>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E9EF', padding: '20px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#676879', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Current task</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{taskTitle}</div>
          {agentSteps.map((step, i) => {
            const isDone = i < activeStepIdx
            const isActive = i === activeStepIdx
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', background: isDone ? '#00C875' : isActive ? '#6C47FF' : '#E6E9EF' }}>{isDone ? '✓' : i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isDone ? '#9999B3' : '#0B0B1A', textDecoration: isDone ? 'line-through' : 'none' }}>{step}</div>
                  {isActive && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {[0, 1, 2].map((d) => (
                        <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }} style={{ width: 5, height: 5, borderRadius: '50%', background: '#6C47FF' }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {activeStepIdx > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E9EF', padding: '20px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#676879', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Output so far</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Draft ready', 'Routed for review', 'Board updated'].slice(0, activeStepIdx).map((tag, i) => (
                <div key={i} style={{ background: 'rgba(0,200,117,0.08)', border: '1px solid #00C875', color: '#00C875', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>✓ {tag}</div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function DashboardSurface() {
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: '#F7F7FB', padding: 24, overflow: 'auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Executive Dashboard</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          {[{ label: 'Projects on track', value: '14 / 17', color: '#00C875' }, { label: 'Budget utilization', value: '76%', color: '#579BFC' }, { label: 'Agent tasks done', value: '243', color: '#A25DDC' }].map((k, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'white', borderRadius: 10, border: '1px solid #E6E9EF', padding: '16px 18px', borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 11, color: '#676879', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{k.value}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E6E9EF', padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Progress by department</div>
          {[{ dept: 'Marketing', pct: 82, color: '#579BFC' }, { dept: 'Product', pct: 67, color: '#A25DDC' }, { dept: 'Operations', pct: 91, color: '#00C875' }, { dept: 'Legal', pct: 55, color: '#FDAB3D' }].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 72, fontSize: 11, color: '#676879', flexShrink: 0 }}>{row.dept}</div>
              <div style={{ flex: 1, height: 8, background: '#F5F6F8', borderRadius: 4 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${row.pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} style={{ height: '100%', background: row.color, borderRadius: 4 }} />
              </div>
              <div style={{ width: 28, fontSize: 11, fontWeight: 600 }}>{row.pct}%</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E6E9EF', padding: '18px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Velocity trend</div>
          <div style={{ fontSize: 11, color: '#676879', marginBottom: 12 }}>Tasks completed per week</div>
          <svg width="100%" height="56" viewBox="0 0 400 56" preserveAspectRatio="none">
            <polyline points="0,50 50,42 100,36 150,22 200,26 250,14 300,9 350,6 400,3" fill="rgba(87,155,252,0.1)" stroke="none" />
            <motion.polyline points="0,50 50,42 100,36 150,22 200,26 250,14 300,9 350,6 400,3" fill="none" stroke="#579BFC" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
          </svg>
        </div>
      </div>
    </div>
  )
}

function WorkflowSurface() {
  const nodes = [
    { id: 1, label: 'Trigger', sub: 'Contract signed', color: '#579BFC', x: 60, y: 120 },
    { id: 2, label: 'Agent', sub: 'Parse contract', color: '#6C47FF', x: 220, y: 60 },
    { id: 3, label: 'Agent', sub: 'Notify Legal', color: '#6C47FF', x: 220, y: 180 },
    { id: 4, label: 'Action', sub: 'Create board', color: '#00C875', x: 380, y: 60 },
    { id: 5, label: 'Action', sub: 'Assign reviewer', color: '#00C875', x: 380, y: 180 },
    { id: 6, label: 'Done', sub: 'All tasks live', color: '#FDAB3D', x: 540, y: 120 },
  ]
  const edges = [[1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6]]
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ flex: 1, background: '#F7F7FB', padding: 24, overflow: 'hidden' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Automation Builder</div>
        <div style={{ fontSize: 12, color: '#676879', marginBottom: 20 }}>When contract is signed → trigger cross-team workflow</div>
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E9EF', padding: 24, position: 'relative', height: 280, overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {edges.map(([from, to], i) => {
              const a = nodes.find((n) => n.id === from)
              const b = nodes.find((n) => n.id === to)
              if (!a || !b) return null
              const x1 = a.x + 60
              const y1 = a.y + 22
              const x2 = b.x
              const y2 = b.y + 22
              return (
                <motion.path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" stroke="#E6E9EF" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} />
              )
            })}
          </svg>
          {nodes.map((node, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 28 }} style={{ position: 'absolute', left: node.x, top: node.y, background: 'white', border: `2px solid ${node.color}`, borderRadius: 10, padding: '8px 14px', minWidth: 110, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: node.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{node.label}</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{node.sub}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {[{ label: 'Runs this month', value: '1,284' }, { label: 'Avg completion', value: '2.3s' }, { label: 'Success rate', value: '99.8%' }].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 8, border: '1px solid #E6E9EF', padding: '10px 16px', flex: 1 }}>
              <div style={{ fontSize: 10, color: '#676879', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GoalDecompositionSurface() {
  const [visibleCards, setVisibleCards] = useState(1)
  useEffect(() => {
    if (visibleCards >= 5) return
    const t = setTimeout(() => setVisibleCards((v) => v + 1), 800)
    return () => clearTimeout(t)
  }, [visibleCards])
  const subProjects = [
    { name: 'Brand & Messaging', owner: 'AL', color: '#579BFC', tasks: 8, status: 'Not started' },
    { name: 'Product Launch', owner: 'SR', color: '#A25DDC', tasks: 12, status: 'Not started' },
    { name: 'Demand Generation', owner: 'MK', color: '#00C875', tasks: 6, status: 'Not started' },
    { name: 'Partner Enablement', owner: 'JL', color: '#FDAB3D', tasks: 9, status: 'Not started' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: '#F7F7FB', padding: 28, overflow: 'auto' }}>
        <div style={{ background: 'white', borderRadius: 12, border: '2px solid var(--primary)', padding: '20px 24px', marginBottom: 24, position: 'relative' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Strategic Goal</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Launch monday AI — Q3 2025</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Target: $2M ARR · 500 new enterprise accounts</div>
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary-tint)', border: '1px solid var(--primary)', padding: '4px 10px', borderRadius: 100 }}>
            <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)' }}>AI breaking down goal...</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 20, color: 'var(--text-xmuted)', marginBottom: 16 }}>↓</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {subProjects.slice(0, visibleCards - 1).map((proj, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} style={{ background: 'white', borderRadius: 10, border: `1px solid ${proj.color}40`, borderLeft: `3px solid ${proj.color}`, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{proj.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: proj.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>{proj.owner}</div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{proj.tasks} tasks</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-xmuted)', background: '#F5F6F8', padding: '2px 8px', borderRadius: 100 }}>{proj.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WorkloadHeatmapSurface() {
  const weeks = ['Oct W1', 'Oct W2', 'Oct W3', 'Oct W4', 'Nov W1', 'Nov W2']
  const people = [
    { name: 'Alex L.', type: 'human', loads: [85, 95, 70, 60, 40, 30] },
    { name: 'Sarah R.', type: 'human', loads: [60, 65, 80, 90, 75, 50] },
    { name: 'Mike K.', type: 'human', loads: [40, 50, 95, 85, 60, 45] },
    { name: 'Jamie L.', type: 'human', loads: [70, 60, 55, 40, 85, 90] },
    { name: '⚡ Brief Writer', type: 'agent', loads: [90, 90, 60, 30, 10, 5] },
    { name: '⚡ Asset Generator', type: 'agent', loads: [20, 80, 90, 70, 40, 20] },
  ]
  const getColor = (load, type) => {
    if (type === 'agent') return `rgba(108,71,255,${(load / 100) * 0.7 + 0.1})`
    if (load > 85) return '#E2445C'
    if (load > 65) return '#FDAB3D'
    return '#00C875'
  }
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: 'white', padding: 24, overflow: 'auto' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Team Workload</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Capacity overview — people & agents</div>
        <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(6, 1fr)', gap: 4, marginBottom: 6 }}>
          <div />
          {weeks.map((w) => (
            <div key={w} style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-xmuted)', textAlign: 'center' }}>{w}</div>
          ))}
        </div>
        {people.map((person, pi) => (
          <div key={pi}>
            {pi === 4 && <div style={{ margin: '10px 0 8px', fontSize: 10, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Agents</div>}
            {pi === 0 && <div style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: 'var(--text-xmuted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Team Members</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(6, 1fr)', gap: 4, marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: person.type === 'agent' ? 600 : 400, color: person.type === 'agent' ? 'var(--primary)' : 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>{person.name}</div>
              {person.loads.map((load, wi) => (
                <motion.div key={wi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: pi * 0.05 + wi * 0.03 }} style={{ height: 32, borderRadius: 6, background: getColor(load, person.type), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'white', opacity: load > 30 ? 1 : 0 }}>{load}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {[['#00C875', 'Under capacity'], ['#FDAB3D', 'Near limit'], ['#E2445C', 'Overloaded'], ['rgba(108,71,255,0.6)', 'Agent load']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KanbanSurface() {
  const columns = [
    { name: 'Backlog', color: '#C4C4C4', items: [
      { name: 'SEO audit', owner: 'SR', ownerColor: '#579BFC' },
      { name: 'Partner deck', owner: 'JL', ownerColor: '#FDAB3D' },
    ]},
    { name: 'In Progress', color: '#579BFC', items: [
      { name: 'Homepage mockup', owner: 'AL', ownerColor: '#A25DDC', agent: '⚡ Designer Agent' },
      { name: 'Copy deck', owner: 'SR', ownerColor: '#579BFC' },
      { name: 'Ad creative set', owner: 'JL', ownerColor: '#FDAB3D', agent: '⚡ Brief Writer' },
    ]},
    { name: 'Review', color: '#FDAB3D', items: [
      { name: 'Campaign brief', owner: 'MK', ownerColor: '#00C875', approved: true },
      { name: 'Budget plan', owner: 'AL', ownerColor: '#A25DDC' },
    ]},
    { name: 'Done', color: '#00C875', items: [
      { name: 'Audience research', owner: 'SR', ownerColor: '#579BFC' },
      { name: 'Brand guidelines', owner: 'MK', ownerColor: '#00C875' },
      { name: 'Q3 kickoff deck', owner: 'JL', ownerColor: '#FDAB3D' },
    ]},
  ]
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: '#F7F7FB', overflow: 'auto' }}>
        <div style={{ padding: '12px 20px', background: 'white', borderBottom: '1px solid #E6E9EF', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Q3 Campaign Launch</div>
          {['Main Table', 'Kanban', 'Gantt'].map((v, i) => (
            <div key={v} style={{ fontSize: 12, color: i === 1 ? 'var(--primary)' : '#676879', fontWeight: i === 1 ? 600 : 400, borderBottom: i === 1 ? '2px solid var(--primary)' : '2px solid transparent', padding: '4px 0' }}>{v}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, padding: 20, height: 'calc(100% - 49px)', overflow: 'auto' }}>
          {columns.map((col, ci) => (
            <div key={ci} style={{ width: 220, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{col.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-xmuted)', background: '#F5F6F8', padding: '1px 6px', borderRadius: 100 }}>{col.items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.items.map((item, ii) => (
                  <motion.div key={ii} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 + ii * 0.04 }} style={{ background: 'white', borderRadius: 8, border: '1px solid #E6E9EF', padding: '12px 14px', borderLeft: `3px solid ${col.color}`, position: 'relative' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: item.ownerColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>{item.owner}</div>
                      {item.approved && <span style={{ fontSize: 10, fontWeight: 600, color: '#00C875', background: 'rgba(0,200,117,0.1)', padding: '2px 8px', borderRadius: 100 }}>✓ Approved</span>}
                    </div>
                    {item.agent && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + ii * 0.2, type: 'spring', stiffness: 400, damping: 25 }} style={{ position: 'absolute', top: -10, right: 8, background: 'var(--primary)', color: 'white', fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 100, boxShadow: '0 2px 8px rgba(108,71,255,0.4)', whiteSpace: 'nowrap' }}>{item.agent}</motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineRiskSurface() {
  const [showRecommendation, setShowRecommendation] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowRecommendation(true), 1500)
    return () => clearTimeout(t)
  }, [])
  const milestones = [
    { name: 'Campaign brief', date: 'Oct 3', done: true, width: '12%', left: '0%' },
    { name: 'Creative assets', date: 'Oct 14', done: true, width: '18%', left: '14%' },
    { name: 'Design sign-off', date: 'Oct 16', done: false, width: '15%', left: '34%', risk: true },
    { name: 'Stakeholder review', date: 'Oct 20', done: false, width: '16%', left: '51%' },
    { name: 'Launch', date: 'Oct 28', done: false, width: '14%', left: '69%' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: 'Poppins', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', background: 'white', padding: 28, overflow: 'auto' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Q3 Campaign — Timeline</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Gantt view · Oct – Nov 2025</div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', marginBottom: 8, paddingLeft: 160 }}>
            {['Oct W1', 'Oct W2', 'Oct W3', 'Oct W4', 'Nov W1'].map((w) => (
              <div key={w} style={{ flex: 1, fontSize: 10, color: 'var(--text-xmuted)', borderLeft: '1px dashed #E6E9EF', paddingLeft: 4 }}>{w}</div>
            ))}
          </div>
          {milestones.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 150, fontSize: 12, fontWeight: 500, flexShrink: 0, paddingRight: 10, color: m.risk ? '#E2445C' : 'var(--text-primary)' }}>
                {m.name}
                {m.risk && <span style={{ marginLeft: 6, fontSize: 10 }}>⚠️</span>}
              </div>
              <div style={{ flex: 1, height: 28, position: 'relative', background: '#F5F6F8', borderRadius: 4 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: m.width }} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', left: m.left, height: '100%', borderRadius: 4, background: m.done ? '#00C875' : m.risk ? '#E2445C' : '#579BFC', display: 'flex', alignItems: 'center', paddingLeft: 8, overflow: 'hidden' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{m.date}</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        {showRecommendation && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} style={{ marginTop: 24, background: 'var(--primary-tint)', border: '1px solid var(--primary)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>AI Recommendation</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.5 }}>
              <strong>Design sign-off</strong> is 3 days behind. Move deadline to Oct 19, or reassign to Sarah R. (12hrs available this week).
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Apply suggestion</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>Dismiss</motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

const LEGAL_GROUPS = BOARD_DATA.Legal?.groups ?? [
  { name: 'Pending Review', color: '#FDAB3D', items: [
    { name: 'Vendor MSA — Acme', owner: 'SR', ownerColor: '#579BFC', status: 'In review', date: 'Oct 9' },
    { name: 'Enterprise SLA draft', owner: 'AL', ownerColor: '#A25DDC', status: 'Working on it', date: 'Oct 11' },
    { name: 'NDA — Global Corp', owner: 'MK', ownerColor: '#00C875', status: 'Waiting', date: 'Oct 13' },
  ]},
  { name: 'Approved', color: '#00C875', items: [
    { name: 'Partner agreement', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 2' },
    { name: 'Q3 renewal — TechCo', owner: 'JL', ownerColor: '#FDAB3D', status: 'Done', date: 'Sep 28' },
  ]},
]
const PRODUCT_GROUPS = BOARD_DATA.Product?.groups ?? [
  { name: 'In Progress', color: '#579BFC', items: [
    { name: 'AI agent builder', owner: 'DW', ownerColor: '#579BFC', status: 'Working on it', date: 'Oct 20' },
    { name: 'Mobile redesign', owner: 'AL', ownerColor: '#A25DDC', status: 'In review', date: 'Oct 18' },
    { name: 'API v3 release', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 25' },
  ]},
  { name: 'Backlog', color: '#C4C4C4', items: [
    { name: 'Gantt improvements', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Nov 5' },
    { name: 'Dashboard templates', owner: 'SR', ownerColor: '#579BFC', status: 'Not started', date: 'Nov 12' },
  ]},
]

function KnowledgeFlow() {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ w: 800, h: 300 })
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { w, h } = size
  const leftEdge = w * 0.32
  const cx = w * 0.5
  const cy = h * 0.5
  const rightEdge = w * 0.68
  const cardYs = [h * 0.18, h * 0.5, h * 0.82]
  const chipYs = [h * 0.37, h * 0.63]
  const inputPaths = cardYs.map((y) => `M ${leftEdge} ${y} C ${leftEdge + (cx - leftEdge) * 0.5} ${y}, ${cx - 30} ${cy}, ${cx} ${cy}`)
  const outputPaths = chipYs.map((y) => `M ${cx} ${cy} C ${cx + 30} ${cy}, ${rightEdge - (rightEdge - cx) * 0.5} ${y}, ${rightEdge} ${y}`)

  return (
    <div style={{ borderRadius: 20, border: '1px solid var(--border)', background: 'white', padding: '40px 32px', backgroundImage: 'radial-gradient(circle, rgba(108,71,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', position: 'relative' }}>
      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 0, minHeight: 300, alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 20 }}>
          {[
            { id: 'company', icon: '⊞', title: 'Company Data', sub: 'Your entire stack, connected', tags: ['Slack', 'Jira', 'Drive', '+200'] },
            { id: 'active', icon: '◈', title: 'Active Work Context', sub: 'Projects, resources, org structure, real-time state', live: true, accent: true },
            { id: 'historical', icon: '◷', title: 'Historical Knowledge', sub: 'Institutional memory that stays when people leave' },
          ].map((card) => (
            <motion.div
              key={card.id}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              animate={{ y: hovered === card.id ? -3 : 0 }}
              style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: card.accent ? '1.5px solid var(--primary)' : '1px solid var(--border)', boxShadow: hovered === card.id ? '0 6px 20px rgba(108,71,255,0.12)' : '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, color: card.accent ? 'var(--primary)' : 'var(--text-muted)' }}>{card.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Poppins' }}>{card.title}</span>
                {card.live && (
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: '50%', background: '#00C875' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#00C875', letterSpacing: '0.05em', fontFamily: 'Poppins' }}>LIVE</span>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: card.tags ? 8 : 0, fontFamily: 'Poppins' }}>{card.sub}</div>
              {card.tags && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {card.tags.map((t) => (
                    <span key={t} style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-xmuted)', background: 'var(--light-bg)', padding: '1px 7px', borderRadius: 100, border: '1px solid var(--border)', fontFamily: 'Poppins' }}>{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <motion.div
            animate={{ boxShadow: hovered ? '0 0 0 14px rgba(108,71,255,0.1), 0 0 48px rgba(108,71,255,0.22)' : '0 0 0 8px rgba(108,71,255,0.07), 0 0 24px rgba(108,71,255,0.10)' }}
            transition={{ duration: 0.4 }}
            style={{ width: 72, height: 72, borderRadius: 18, background: 'white', border: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #6C47FF 0%, #A25DDC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'Poppins' }}>m</div>
            <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', fontFamily: 'Poppins' }}>AI</div>
          </motion.div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 20 }}>
          {[
            { icon: '👤', label: 'Your teams', sub: 'Always in context' },
            { icon: '⚡', label: 'Your agents', sub: 'Ready to act' },
          ].map((chip, i) => (
            <motion.div
              key={i}
              animate={{ boxShadow: hovered ? '0 4px 20px rgba(108,71,255,0.15)' : '0 1px 4px rgba(0,0,0,0.04)' }}
              transition={{ duration: 0.3 }}
              style={{ background: 'var(--primary-tint)', border: '1.5px solid rgba(108,71,255,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ fontSize: 22 }}>{chip.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 2, fontFamily: 'Poppins' }}>{chip.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Poppins' }}>{chip.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}>
          <defs>
            <linearGradient id="flowIn" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C47FF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6C47FF" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="flowOut" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C47FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6C47FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {inputPaths.map((d, i) => (
            <motion.path
              key={`in-${i}`}
              d={d}
              fill="none"
              stroke="url(#flowIn)"
              strokeWidth="1.5"
              strokeDasharray="5 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, strokeDashoffset: -33 }}
              transition={{ pathLength: { duration: 0.7, delay: i * 0.15 }, opacity: { duration: 0.7, delay: i * 0.15 }, strokeDashoffset: { duration: 1.8 + i * 0.2, repeat: Infinity, repeatType: 'loop', delay: 0.7 + i * 0.15 } }}
            />
          ))}
          {outputPaths.map((d, i) => (
            <motion.path
              key={`out-${i}`}
              d={d}
              fill="none"
              stroke="url(#flowOut)"
              strokeWidth="2"
              strokeDasharray="5 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, strokeDashoffset: -33 }}
              transition={{ pathLength: { duration: 0.7, delay: 0.5 + i * 0.15 }, opacity: { duration: 0.7, delay: 0.5 + i * 0.15 }, strokeDashoffset: { duration: 1.3 + i * 0.1, repeat: Infinity, repeatType: 'loop', delay: 1.2 + i * 0.15 } }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

const STEPS_DATA = [
  { title: 'Strategy & Planning', desc: 'Turn goals into structured plans aligned to your strategy from day one.' },
  { title: 'Resource Management', desc: 'Allocate work across people and agents — balancing capacity, cost, and impact.' },
  { title: 'Execution & Delivery', desc: 'Coordinate tasks, handoffs, and approvals without the follow-up.' },
  { title: 'Tracking & Monitoring', desc: 'Monitor progress in real time and act on AI recommendations in one click.' },
  { title: 'Reporting & Insights', desc: 'Role-based views connecting progress, spend, and outcomes for every decision.' },
]

const GUARDRAILS_PILLARS = [
  { id: 'security', label: 'Security', toggles: [
    { label: 'Role-based permissions', on: true }, { label: 'Data encryption at rest', on: true }, { label: 'SSO & identity management', on: true }, { label: 'Third-party access controls', on: false },
  ]},
  { id: 'transparency', label: 'Transparency', toggles: [
    { label: 'AI action explanations', on: true }, { label: 'Decision audit log', on: true }, { label: 'Agent activity feed', on: false }, { label: 'Weekly AI summary digest', on: false },
  ]},
  { id: 'accountability', label: 'Accountability', toggles: [
    { label: 'Human sign-off on critical actions', on: true }, { label: 'Timestamped approval records', on: true }, { label: 'Agent attribution on all changes', on: true }, { label: 'Automated compliance reports', on: false },
  ]},
  { id: 'control', label: 'Control', toggles: [
    { label: 'Override any agent action', on: true }, { label: 'Pause agents by board or workspace', on: true }, { label: 'Level of context: ○ Board ● Workspace ○ Account', on: true }, { label: 'Connected: Slack · Jira · Salesforce', on: true },
  ]},
]

const WHY_ROWS = [
  { num: '01', title: 'Ease of use that drives adoption', body: 'Hyper-personalization and intuitive design drive adoption and a more complete picture of work.', proof: 'g2' },
  { num: '02', title: 'Expertise from real-world work', body: 'AI capabilities shaped by 250K+ customers across industries and the world\'s most productive teams.', proof: 'scale' },
  { num: '03', title: 'Enterprise control without compromise', body: 'Trusted by the world\'s most complex organizations — with governance and permissions to prove it.', proof: 'fortune' },
  { num: '04', title: 'Deep understanding of your business', body: 'Unifies data, work context, and institutional knowledge into a single intelligence layer for people and agents.', proof: 'integrations' },
]

export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [demoFrame, setDemoFrame] = useState(0)
  const [demoTyped, setDemoTyped] = useState('')
  const [demoStatusDoneCount, setDemoStatusDoneCount] = useState(0)
  const [agentsTab, setAgentsTab] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [guardrailsPillar, setGuardrailsPillar] = useState(0)
  const [guardrailsCategory, setGuardrailsCategory] = useState(0)
  const heroRef = useRef(null)
  const proof50Ref = useRef(null)
  const proofScaleRef = useRef(null)
  const proofFortuneRef = useRef(null)
  const proofIntegrationsRef = useRef(null)
  const proof50InView = useInView(proof50Ref, { once: true, amount: 0.2 })
  const proofScaleInView = useInView(proofScaleRef, { once: true, amount: 0.2 })
  const proofFortuneInView = useInView(proofFortuneRef, { once: true, amount: 0.2 })
  const proofIntegrationsInView = useInView(proofIntegrationsRef, { once: true, amount: 0.2 })
  const count50 = useCountUp(50, 1500, proof50InView)
  const count250 = useCountUp(250, 1200, proofScaleInView)
  const count60 = useCountUp(60, 1200, proofFortuneInView)

  const { scrollYProgress, scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)'])
  const navBlur = useTransform(scrollY, [0, 80], [0, 16])
  const navEdge = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.08)'])
  const heroY = useTransform(useScroll().scrollY, [0, 400], [0, -60])

  // Demo sequence loop: 13s cycle, frames 0..6 then restart
  const promptText = 'Plan Q3 product launch campaign'
  const frameDurations = [800, 2000, 1000, 2000, 2000, 2000, 2000, 1200]
  const demoStartRef = useRef(Date.now())
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - demoStartRef.current) % 13000
      if (elapsed < 100) {
        setDemoFrame(0)
        setDemoTyped('')
        return
      }
      let acc = 0
      for (let i = 0; i < frameDurations.length; i++) {
        if (elapsed < acc + frameDurations[i]) {
          setDemoFrame(i)
          break
        }
        acc += frameDurations[i]
      }
    }, 100)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (demoFrame === 0) { setDemoTyped(''); setDemoStatusDoneCount(0) }
    if (demoFrame === 1 && demoTyped.length < promptText.length) {
      const t = setTimeout(() => setDemoTyped((s) => promptText.slice(0, s.length + 1)), 75)
      return () => clearTimeout(t)
    }
  }, [demoFrame, demoTyped])
  // Frame 5: animate status cells to Done left-to-right, 180ms stagger (Marketing board has 8 items)
  const MARKETING_BOARD_ITEMS = 8
  useEffect(() => {
    if (demoFrame !== 5) return
    setDemoStatusDoneCount(0)
    let n = 0
    const id = setInterval(() => {
      n++
      setDemoStatusDoneCount((c) => (c < MARKETING_BOARD_ITEMS ? c + 1 : c))
      if (n >= MARKETING_BOARD_ITEMS) clearInterval(id)
    }, 180)
    return () => clearInterval(id)
  }, [demoFrame])


  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)',
          transformOrigin: 'left', scaleX: scrollYProgress, zIndex: 100,
        }}
      />

      {/* [01] Navbar */}
      <motion.nav
        style={{
          position: 'sticky', top: 0, zIndex: 50, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', background: navBg, backdropFilter: navBlur, WebkitBackdropFilter: navBlur,
          borderBottom: navEdge, borderBottomWidth: 1, borderBottomStyle: 'solid',
        }}
      >
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.fast, delay: 0 }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 2, background: 'var(--primary)' }} />
          <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>monday</span>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_LINKS.map((link, i) => (
            <motion.a key={link} href="#" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14, color: 'var(--text-muted)' }}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.fast, delay: 0.06 * (i + 1) }}
              whileHover={{ color: 'var(--text-primary)' }}
            >{link}</motion.a>
          ))}
        </div>
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.fast, delay: 0.24 }}
        >
          <motion.button {...ghostBtn} style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Log in</motion.button>
          <motion.button {...primaryBtn} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: 'white', background: 'var(--primary)', border: 'none', borderRadius: 100, padding: '10px 20px', cursor: 'pointer' }}>Get started</motion.button>
        </motion.div>
      </motion.nav>

      {/* [02] Hero */}
      <motion.section
        ref={heroRef}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setMouse({ x: e.clientX - r.left, y: e.clientY - r.top })
        }}
        style={{ position: 'relative', background: 'white', padding: '120px clamp(32px, 5vw, 64px) 80px', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,71,255,0.05) 0%, transparent 70%)',
            transform: `translate(${mouse.x - 250}px, ${mouse.y - 250}px)`,
            transition: 'transform 0.12s ease',
          }} />
        </div>
        <motion.div style={{ y: heroY, maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 0.5, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease: EASE.out }}
            style={{ fontFamily: 'Poppins', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(38px, 4.5vw, 58px)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}
          >This is where work used to be managed.</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: 'clamp(48px, 6.5vw, 88px)',
              color: 'var(--text-primary)',
              margin: '16px 0 0',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
            }}
          >Now it's where it gets done.</motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.5 }}
            style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 18, color: 'var(--text-muted)', maxWidth: 480, margin: '24px auto 0', lineHeight: 1.7 }}
          >You set the direction. AI agents execute across every team, every workflow, every use case.</motion.p>

          <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 40 }}>
            <motion.button {...primaryBtn} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, color: 'white', background: 'var(--primary)', border: 'none', borderRadius: 12, padding: '14px 28px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(108,71,255,0.25)' }}>Get started free</motion.button>
            <motion.button {...ghostBtn} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.35 }} style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 15, color: 'var(--text-primary)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 28px', cursor: 'pointer' }}>See it in action →</motion.button>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: 'var(--text-xmuted)', marginTop: 14, opacity: 0.9 }}>No credit card required</motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)', marginTop: 56, opacity: 0.85 }}>Already trusted by 250K+ customers worldwide</motion.p>
          <div className="marquee-outer" style={{ marginTop: 24 }}>
            <div className="marquee-track">
              {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((name, i) => (
                <span key={i} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: 'var(--text-muted)', opacity: 0.45, minWidth: 110, textAlign: 'center' }}>{name}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* [03] Demo */}
      <section style={{ background: 'var(--light-bg)', padding: '80px clamp(32px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 16px 56px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)', background: 'white' }}>
            <div style={{ height: 44, background: '#F5F5F7', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
              <div style={{ margin: '0 auto', background: 'white', borderRadius: 6, padding: '4px 20px', fontSize: 12, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>app.monday.com</div>
            </div>
            <div style={{ position: 'relative', minHeight: 520, background: demoFrame >= 3 ? 'var(--light-bg)' : 'white' }}>
              <AnimatePresence mode="wait">
                {demoFrame === 0 && (
                  <motion.div key="f0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                      <span style={{ fontFamily: 'Poppins', fontSize: 14, color: 'var(--text-muted)' }}>Describe what you want to build...</span>
                      <motion.span style={{ width: 2, height: 16, background: 'var(--primary)' }} {...cursorBlink} />
                    </div>
                  </motion.div>
                )}
                {demoFrame === 1 && (
                  <motion.div key="f1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                      <span style={{ fontFamily: 'Poppins', fontSize: 14, color: 'var(--text-primary)' }}>{demoTyped}</span>
                      <motion.span style={{ width: 2, height: 16, background: 'var(--primary)' }} {...cursorBlink} />
                    </div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                      {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ width: 120, height: 24 }} />)}
                    </motion.div>
                  </motion.div>
                )}
                {demoFrame === 2 && (
                  <motion.div key="f2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14, color: 'var(--text-muted)' }}>Thinking</span>
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>...</motion.span>
                    </div>
                  </motion.div>
                )}
                {demoFrame >= 3 && (
                  <motion.div key="f3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    <MondayBoardMockup
                      department="Marketing"
                      statusDoneCount={demoFrame >= 5 ? (demoFrame === 5 ? demoStatusDoneCount : MARKETING_BOARD_ITEMS) : undefined}
                    />
                    {demoFrame === 4 && (
                      <motion.div
                        {...agentPop}
                        style={{
                          position: 'absolute', top: 230, left: 280, background: 'var(--primary)', color: 'white', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, boxShadow: '0 2px 12px rgba(108,71,255,0.5)', zIndex: 20, whiteSpace: 'nowrap', fontFamily: 'Poppins',
                        }}
                      >
                        ⚡ Brief Writer · Drafting...
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* [08] Platform Statement — 4 pillars */}
      <section style={{ background: 'white', padding: '88px clamp(32px, 5vw, 64px)', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 'clamp(24px, 2.8vw, 34px)', color: 'var(--text-primary)', lineHeight: 1.55, margin: 0, letterSpacing: '-0.01em' }}>
          monday work management is the complete system for AI-powered work execution. Where humans lead — and agents execute.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 28 }}>
          {['Specialized agents', 'Human orchestration', 'Complete work platform', 'One shared brain'].map((pill) => (
            <motion.span
              key={pill}
              whileHover={{ scale: 1.02, borderColor: 'rgba(108,71,255,0.25)', color: 'var(--text-primary)', boxShadow: '0 2px 12px rgba(108,71,255,0.08)' }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 100, padding: '10px 18px', backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', whiteSpace: 'nowrap' }}
            >{pill}</motion.span>
          ))}
        </div>
      </section>

      {/* [05] Purpose-Built Agents — full-width immersive, no columns */}
      <section style={{ background: 'var(--light-bg)', paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px clamp(32px, 5vw, 64px) 40px' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-xmuted)', marginBottom: 20 }}>1 / 4</div>
          <Eyebrow>Specialized Agents</Eyebrow>
          <h2 style={{ fontFamily: 'Poppins', fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 600, margin: 0, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>Built for every team.</h2>
          <p style={{ fontFamily: 'Poppins', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.4 }}>Purpose-built for the work they actually do.</p>
        </div>
        <div style={{ position: 'sticky', top: 64, zIndex: 10, background: 'rgba(255,255,255,0.98)', borderBottom: '1px solid var(--border)', padding: '0 clamp(32px, 5vw, 64px)', backdropFilter: 'saturate(1.1) blur(12px)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 0 }}>
            {['PMO', 'Legal', 'HR', 'Product', 'Marketing', 'IT', 'Operations'].map((tab, i) => (
              <motion.button
                key={tab}
                onClick={() => setAgentsTab(i)}
                style={{ padding: '14px 22px', border: 'none', background: 'none', fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: agentsTab === i ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', position: 'relative' }}
              >
                {tab}
                {agentsTab === i && (
                  <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--primary)', borderRadius: '2px 2px 0 0' }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={agentsTab}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative', width: '100%', maxWidth: 800, margin: '0 auto', height: '70vh', minHeight: 500, overflow: 'hidden', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 600, color: 'var(--text-primary)', opacity: 0.035, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', zIndex: 0, fontFamily: 'Poppins' }}>
              {['PMO', 'Legal', 'HR', 'Product', 'Marketing', 'IT', 'Operations'][agentsTab]}
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', overflow: 'hidden' }}>
              {[
                <DashboardSurface key="pmo" />,
                <MondayBoardSurface key="legal" boardName="Contract Management" groups={[{ name: 'Pending Review', color: '#FDAB3D', items: [{ name: 'Vendor MSA — Acme Corp', owner: 'SR', ownerColor: '#579BFC', status: 'In review', date: 'Oct 9' }, { name: 'Enterprise SLA draft', owner: 'AL', ownerColor: '#A25DDC', status: 'Working on it', date: 'Oct 11' }, { name: 'NDA — Global Corp', owner: 'MK', ownerColor: '#00C875', status: 'Waiting', date: 'Oct 13' }] }, { name: 'Approved', color: '#00C875', items: [{ name: 'Partner agreement Q3', owner: 'SR', ownerColor: '#579BFC', status: 'Done', date: 'Oct 2' }, { name: 'Q3 renewal — TechCo', owner: 'JL', ownerColor: '#FDAB3D', status: 'Done', date: 'Sep 28' }] }]} />,
                <AgentSurface key="hr" agentName="HR Onboarding Agent" taskTitle="Onboard Alex Chen — Senior Designer" steps={['Create onboarding board', 'Send welcome email & contracts', 'Assign IT equipment task', 'Schedule manager intro call', 'Notify People team']} />,
                <MondayBoardSurface key="product" boardName="Product Roadmap — Q4" groups={[{ name: 'In Sprint', color: '#579BFC', items: [{ name: 'AI agent builder', owner: 'DW', ownerColor: '#579BFC', status: 'Working on it', date: 'Oct 20' }, { name: 'Mobile redesign', owner: 'AL', ownerColor: '#A25DDC', status: 'In review', date: 'Oct 18' }, { name: 'API v3 release', owner: 'MK', ownerColor: '#00C875', status: 'Working on it', date: 'Oct 25' }] }, { name: 'Backlog', color: '#C4C4C4', items: [{ name: 'Gantt improvements', owner: 'JL', ownerColor: '#FDAB3D', status: 'Not started', date: 'Nov 5' }, { name: 'Dashboard templates', owner: 'SR', ownerColor: '#579BFC', status: 'Not started', date: 'Nov 12' }] }]} />,
                <AgentSurface key="marketing" agentName="Campaign Agent" taskTitle="Build Q3 campaign plan from brief" steps={['Parse campaign brief', 'Generate task breakdown', 'Assign owners & deadlines', 'Create campaign board', 'Notify stakeholders']} />,
                <WorkflowSurface key="it" />,
                <WorkflowSurface key="ops" />,
              ][agentsTab]}
            </div>
            <motion.div
              key={`card-${agentsTab}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ position: 'absolute', bottom: 32, left: 32, zIndex: 10, background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', maxWidth: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              <div style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{DEPT_DATA[agentsTab].name}</div>
              <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{DEPT_DATA[agentsTab].description}</div>
              {DEPT_DATA[agentsTab].actions.map((action, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: 'var(--text-primary)' }}>{action}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* [06] Every Step of Work — left: all steps visible; right: surface mockup */}
      <section style={{ background: 'white', padding: '48px clamp(32px, 5vw, 64px) 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-xmuted)', marginBottom: 20 }}>2 / 4</div>
          <Eyebrow>complete work platform</Eyebrow>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(26px, 2.8vw, 40px)', color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.015em' }}>Every step of work, in one place.</h2>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 17, color: 'var(--text-muted)', margin: 0 }}>From the first goal to the final report.</p>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(32px, 5vw, 64px)', display: 'flex', background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Left panel — steps list, compact */}
          <div style={{ width: 300, flexShrink: 0, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto' }}>
            {STEPS_DATA.map((step, i) => (
              <motion.div
                key={i}
                onClick={() => setStepIndex(i)}
                animate={{ opacity: stepIndex === i ? 1 : 0.5 }}
                whileHover={{ opacity: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{ padding: '12px 0', paddingLeft: 10, borderBottom: '1px solid var(--border)', cursor: 'pointer', borderLeft: stepIndex === i ? '3px solid var(--primary)' : '3px solid transparent' }}
              >
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', color: stepIndex === i ? 'var(--primary)' : 'var(--text-xmuted)', marginBottom: 2, textTransform: 'uppercase', fontFamily: 'Poppins' }}>
                  {String(i + 1).padStart(2, '0')} / 05
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, fontFamily: 'Poppins', letterSpacing: '-0.01em' }}>{step.title}</div>
                <div style={{ fontSize: 11, color: stepIndex === i ? 'var(--text-muted)' : 'var(--text-xmuted)', lineHeight: 1.45, fontFamily: 'Poppins' }}>{step.desc}</div>
              </motion.div>
            ))}
          </div>
          {/* Right panel — surface mockup (one unique surface per step) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
              style={{ flex: 1, minHeight: 520, overflow: 'hidden', borderRadius: 12, border: '1px solid var(--border)', position: 'relative' }}
            >
              {[
                <GoalDecompositionSurface key="s1" />,
                <WorkloadHeatmapSurface key="s2" />,
                <KanbanSurface key="s3" />,
                <TimelineRiskSurface key="s4" />,
                <DashboardSurface key="s5" />,
              ][stepIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* [07] The Knowledge Layer — one shared brain */}
      <section style={{ background: 'var(--light-bg)', padding: '100px clamp(32px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-xmuted)', marginBottom: 20 }}>3 / 4</div>
          <Eyebrow>ONE SHARED BRAIN</Eyebrow>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(26px, 2.8vw, 40px)', color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.015em' }}>The context that makes it all possible.</h2>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 17, color: 'var(--text-muted)', marginBottom: 8 }}>One unified layer powering every person and every agent.</p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: 'var(--text-xmuted)', marginBottom: 40, letterSpacing: '0.02em' }}>data · context · knowledge</p>
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <KnowledgeFlow />
          </div>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24, opacity: 0.9 }}>Company Data · Active Work Context · Historical Knowledge</p>
        </div>
      </section>

      {/* Human orchestration — delicate */}
      <section style={{ background: 'var(--near-white)', padding: '88px clamp(32px, 5vw, 64px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-xmuted)', marginBottom: 20 }}>4 / 4</div>
          <Eyebrow>HUMAN ORCHESTRATION</Eyebrow>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 'clamp(24px, 2.6vw, 36px)', color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.28, letterSpacing: '-0.01em' }}>You set the guardrails.</h2>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>Tell agents what to do — and keep them in their lane.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 36 }}>
          {[
            { id: 'workflow', label: 'Tell the agents what to do' },
            { id: 'toggles', label: 'Make sure they always stay in their lane' },
          ].map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => setGuardrailsCategory(i)}
              animate={{ background: guardrailsCategory === i ? 'var(--primary)' : 'transparent', color: guardrailsCategory === i ? 'white' : 'var(--text-muted)', borderColor: guardrailsCategory === i ? 'var(--primary)' : 'var(--border)' }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.25 }}
              style={{ padding: '10px 20px', borderRadius: 100, border: '1px solid', fontSize: 12, fontWeight: 500, fontFamily: 'Poppins', cursor: 'pointer', textAlign: 'center', maxWidth: 340 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {guardrailsCategory === 0 && (
            <motion.div key="workflow" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} style={{ maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 14, border: '1px solid var(--border)', padding: '24px 26px', boxShadow: '0 1px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ fontFamily: 'Poppins', fontSize: 13, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>Define automations and agent behavior in one place.</motion.p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { label: 'Trigger', sub: 'Status changes', color: '#579BFC' },
                    { label: 'Condition', sub: 'If / else', color: '#FDAB3D' },
                    { label: 'Action', sub: 'Run agent', color: 'var(--primary)' },
                    { label: 'Done', sub: 'Tasks live', color: '#00C875' },
                  ].map((node, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <motion.div
                        initial={{ opacity: 0, x: -16, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        whileHover={{ y: -3, boxShadow: `0 4px 12px ${node.color}30`, transition: { duration: 0.2 } }}
                        style={{ background: 'white', border: `1px solid ${node.color}`, borderRadius: 8, padding: '6px 12px', minWidth: 80, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                      >
                        <div style={{ fontSize: 8, fontWeight: 600, color: node.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>{node.label}</div>
                        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-primary)' }}>{node.sub}</div>
                      </motion.div>
                      {i < 3 && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 0.8, scaleX: 1 }}
                          transition={{ delay: 0.35 + i * 0.12, duration: 0.25 }}
                          style={{ width: 12, height: 1, background: 'var(--border)', margin: '0 4px', flexShrink: 0, transformOrigin: 'left' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.3 }} style={{ textAlign: 'center' }}>
                  <a href="#" style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, color: 'var(--primary)', textDecoration: 'none', opacity: 0.9 }}>Explore →</a>
                </motion.div>
              </div>
            </motion.div>
          )}
          {guardrailsCategory === 1 && (
            <motion.div key="toggles" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} style={{ maxWidth: 520, margin: '0 auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                {GUARDRAILS_PILLARS.map((p, i) => (
                  <motion.button key={p.id} onClick={() => setGuardrailsPillar(i)} animate={{ background: guardrailsPillar === i ? 'var(--primary)' : 'transparent', color: guardrailsPillar === i ? 'white' : 'var(--text-muted)', borderColor: guardrailsPillar === i ? 'var(--primary)' : 'var(--border)' }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.25 }} style={{ padding: '6px 14px', borderRadius: 100, border: '1px solid', fontSize: 11, fontWeight: 500, fontFamily: 'Poppins', cursor: 'pointer' }}>{p.label}</motion.button>
                ))}
              </div>
              <div style={{ position: 'relative', background: 'white', borderRadius: 14, border: '1px solid var(--border)', padding: '26px 30px', boxShadow: '0 1px 12px rgba(0,0,0,0.03)' }}>
                <motion.span {...livePulse} style={{ position: 'absolute', top: 18, right: 22, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)' }} />
                <AnimatePresence mode="wait">
                  <motion.div key={guardrailsPillar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} layout>
                    {GUARDRAILS_PILLARS[guardrailsPillar].toggles.map((row) => (
                      <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'var(--text-primary)' }}>{row.label}</span>
                        <Toggle on={row.on} toggle={() => {}} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* [09] Why monday — differentiators (proof that backs the story) */}
      <section style={{ background: 'white', padding: '88px clamp(32px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <Eyebrow>WHY MONDAY</Eyebrow>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(26px, 2.8vw, 40px)', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.25, letterSpacing: '-0.015em' }}>Why monday work management.</h2>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 16, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 560 }}>Trusted by teams everywhere — here’s what makes the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {WHY_ROWS.map((row, i) => (
              <motion.div
                key={row.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ borderColor: 'rgba(108,71,255,0.25)', backgroundColor: 'var(--primary-tint)' }}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'border-color 0.25s ease, background-color 0.25s ease',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: 28, color: 'var(--text-xmuted)', lineHeight: 1 }}>{row.num}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--text-primary)', lineHeight: 1.3, margin: 0, letterSpacing: '-0.01em' }}>{row.title}</h3>
                  </div>
                </div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, flex: 1 }}>{row.body}</p>
                <div style={{ marginTop: 4 }}>
                  {row.proof === 'g2' && <div style={{ background: '#FF492C', color: 'white', borderRadius: 10, padding: '12px 16px', textAlign: 'center', width: '100%', maxWidth: 140 }}><div style={{ fontSize: 13, marginBottom: 4 }}>★★★★★</div><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>HIGHEST ADOPTION</div><div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>Winter 2025</div></div>}
                  {row.proof === 'scale' && <div ref={proofScaleRef} style={{ textAlign: 'left' }}><div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)' }}>{count250}K+ customers</div><div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 18, color: 'var(--text-primary)' }}>200+ industries</div></div>}
                  {row.proof === 'fortune' && <div ref={proofFortuneRef}><div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 36, color: 'var(--text-primary)' }}>{count60}%</div><div style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>of the Fortune 500 run on monday</div></div>}
                  {row.proof === 'integrations' && <div ref={proofIntegrationsRef}><div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>200+ integrations</div><div style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Connect your stack · REST API · MCP support</div></div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-dark bleed */}
      <div className="pre-dark-bleed" />

      {/* [10] Proof — the outcome that backs the story */}
      <section style={{ background: 'var(--dark)', padding: '100px clamp(32px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div ref={proof50Ref} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 'clamp(80px, 12vw, 112px)', color: 'white', lineHeight: 1, letterSpacing: '-0.03em' }}>{count50}%</div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 17, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>faster project delivery</div>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE.out }} viewport={{ once: true, amount: 0.2 }} style={{ background: 'white', borderRadius: 20, padding: 44, marginTop: 56, position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
            <div style={{ position: 'absolute', top: 24, left: 32, fontSize: 72, fontWeight: 800, lineHeight: 1, color: 'var(--primary)', opacity: 0.35 }}>"</div>
            <p style={{ fontFamily: 'Poppins', fontSize: 19, fontWeight: 400, lineHeight: 1.65, marginTop: 36, color: 'var(--text-primary)' }}>monday's AI helped us cut our project planning time in half. What used to take days now takes minutes.</p>
            <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <strong style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Sarah Luxemberg</strong>
              <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontFamily: 'Poppins', fontWeight: 400 }}>· Operations Director, VML</span>
            </div>
          </motion.div>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginTop: 64, marginBottom: 24 }}>TRUSTED BY ENTERPRISES. RECOGNIZED BY INDUSTRY LEADERS.</p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'center', opacity: 0.4 }}>{['Uber', 'Coca-Cola', 'Canva', 'Lionsgate', 'Universal', 'Unilever'].map((n) => <span key={n} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: 'white' }}>{n}</span>)}</motion.div>
            <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'center', opacity: 0.4 }}>{['Gartner', 'Forrester', 'G2', 'Forbes'].map((n) => <span key={n} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: 'white' }}>{n}</span>)}</motion.div>
          </motion.div>
        </div>
      </section>

      {/* [11] Final CTA */}
      <section style={{ background: 'var(--dark)', padding: '140px clamp(32px, 5vw, 64px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {(() => {
            const particles = Array.from({ length: 36 }, (_, i) => ({
              left: (i * 7.3 + 13) % 100,
              top: (i * 11.7 + 31) % 100,
              opacity: 0.05 + (i % 8) * 0.02,
              duration: 22 + (i % 36),
              delay: i * 0.5,
            }))
            return particles.map((p, i) => (
              <div key={i} style={{ position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: 'white', opacity: p.opacity, left: `${p.left}%`, top: `${p.top}%`, animation: `drift ${p.duration}s linear ${p.delay}s infinite` }} />
            ))
          })()}
        </div>
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} viewport={{ once: true }} style={{ fontFamily: 'Poppins', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(32px, 3.6vw, 46px)', color: 'white', margin: 0, lineHeight: 1.25 }}>This is where work used to be managed.</motion.p>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 }} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(40px, 4.5vw, 56px)', color: 'white', margin: '14px 0 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>Now it's where it gets done.</motion.p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 22, lineHeight: 1.5 }}>Start today. Your teams lead. Agents do the rest.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 44 }}>
            <motion.button {...primaryBtn} style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', background: 'white', border: 'none', borderRadius: 12, padding: '14px 30px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>Get started free</motion.button>
            <motion.button {...ghostBtn} style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 15, color: 'white', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '14px 30px', cursor: 'pointer' }}>Talk to sales</motion.button>
          </div>
        </div>
      </section>

      {/* [12] Footer */}
      <footer style={{ background: 'var(--dark)', borderTop: '1px solid var(--dark-border)', padding: '44px clamp(32px, 5vw, 64px) 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: 2, background: 'var(--primary)' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: 'white' }}>monday</span>
            </div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>The AI-powered work OS</p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {['Product', 'Solutions', 'Resources', 'Company'].map((col) => (
              <div key={col}>
                <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>{col}</div>
                <a href="#" style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Link</a>
                <a href="#" style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Link</a>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}><Linkedin size={18} /></a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}><Twitter size={18} /></a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}><Youtube size={18} /></a>
          </div>
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto', borderTop: '1px solid var(--dark-border)', paddingTop: 24, fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.28)', textAlign: 'center' }}>© 2025 monday.com · Privacy · Terms · Security</div>
      </footer>
    </>
  )
}
