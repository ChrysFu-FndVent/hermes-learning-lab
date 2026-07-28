import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ExternalLink,
  FileCode2,
  GitFork,
  Layers3,
  Menu,
  Play,
  RefreshCcw,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import { architectureLayers, lessons, repositories } from "./data";

const STORAGE_KEY = "hermes-learning-lab-progress-v1";

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (value?.version === 1 && Array.isArray(value.completed)) return value;
  } catch {
    // Invalid local data should never block the learning surface.
  }
  return { version: 1, completed: [], activeLesson: 0 };
}

function ProgressRing({ value }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="progress-ring" aria-label={`总掌握度 ${value}%`}>
      <svg viewBox="0 0 92 92" aria-hidden="true">
        <circle className="progress-ring-track" cx="46" cy="46" r={radius} />
        <circle
          className="progress-ring-value"
          cx="46"
          cy="46"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <strong>{value}%</strong>
    </div>
  );
}

function CourseSidebar({ activeIndex, completed, onSelect, open, onClose }) {
  return (
    <>
      {open ? <button className="sidebar-scrim" aria-label="关闭课程导航" onClick={onClose} /> : null}
      <aside className={`course-sidebar ${open ? "is-open" : ""}`}>
        <div className="brand-block">
          <div className="brand-mark"><Bot size={17} /></div>
          <div>
            <strong>HERMES LAB</strong>
            <span>交互式入门课程</span>
          </div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="关闭课程导航">
            <X size={18} />
          </button>
        </div>

        <div className="course-progress-copy">
          <span>学习进度</span>
          <strong>{completed.length} / {lessons.length}</strong>
        </div>
        <div className="linear-progress" aria-hidden="true">
          <span style={{ width: `${(completed.length / lessons.length) * 100}%` }} />
        </div>

        <nav className="lesson-nav" aria-label="课程目录">
          <span className="section-label">学习路径</span>
          {lessons.map((lesson, index) => {
            const isComplete = completed.includes(lesson.id);
            const isActive = activeIndex === index;
            return (
              <button
                key={lesson.id}
                className={`lesson-link ${isActive ? "is-active" : ""}`}
                onClick={() => { onSelect(index); onClose(); }}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="lesson-index">{isComplete ? <Check size={13} /> : lesson.number}</span>
                <span>
                  <strong>{lesson.title}</strong>
                  <small>{lesson.duration}</small>
                </span>
                <ChevronRight size={15} />
              </button>
            );
          })}
        </nav>

        <div className="source-note">
          <GitFork size={14} />
          <span>依据官方仓库与文档整理</span>
        </div>
      </aside>
    </>
  );
}

function AppTopbar({ view, setView, lesson, saved, onOpenMenu }) {
  const tabs = [
    { id: "course", label: "课程", icon: BookOpen },
    { id: "research", label: "项目研究", icon: GitFork },
    { id: "architecture", label: "架构", icon: Layers3 },
  ];

  return (
    <header className="app-topbar">
      <div className="topbar-context">
        <button className="icon-button menu-button" onClick={onOpenMenu} aria-label="打开课程导航">
          <Menu size={19} />
        </button>
        <span>{view === "course" ? `基础训练 / ${lesson.number} ${lesson.title}` : "Hermes Learning Lab"}</span>
      </div>
      <div className="view-tabs" role="tablist" aria-label="视图">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={view === tab.id}
              className={view === tab.id ? "is-active" : ""}
              onClick={() => setView(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <span className="save-state"><span />{saved ? "已自动保存" : "保存中"}</span>
    </header>
  );
}

function TracePanel({ lesson }) {
  return (
    <div className="trace-strip" aria-label="Hermes 回合轨迹">
      {lesson.trace.map((item, index) => (
        <div key={item}>
          <span>{index + 1}</span>
          <p>{item}</p>
          {index < lesson.trace.length - 1 ? <ArrowRight size={14} /> : null}
        </div>
      ))}
    </div>
  );
}

function BuilderFields({ fields, values, setValues }) {
  return (
    <div className="builder-fields">
      {fields.map((field) => (
        <label key={field.id}>
          <span>{field.label}</span>
          {field.type === "select" ? (
            <select
              value={values[field.id] || ""}
              onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
            >
              <option value="">请选择</option>
              {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : (
            <input
              value={values[field.id] || ""}
              placeholder={field.placeholder}
              onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
            />
          )}
        </label>
      ))}
    </div>
  );
}

function PracticePanel({ lesson, isCompleted, onComplete }) {
  const practice = lesson.practice;
  const [selection, setSelection] = useState(practice.type === "multi" ? [] : "");
  const [values, setValues] = useState({});
  const [status, setStatus] = useState(isCompleted ? "success" : "idle");

  const commandPreview = practice.type === "builder" ? practice.commandTemplate(values) : lesson.command;

  const toggleSelection = (id) => {
    if (practice.type === "multi") {
      setSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    } else {
      setSelection(id);
    }
    if (status === "error") setStatus("idle");
  };

  const evaluate = () => {
    let passed = false;
    if (practice.type === "choice") passed = selection === practice.correct;
    if (practice.type === "multi") {
      const selected = [...selection].sort().join("|");
      const expected = [...practice.correct].sort().join("|");
      passed = selected === expected;
    }
    if (practice.type === "builder") {
      const allFilled = practice.fields.every((field) => String(values[field.id] || "").trim());
      const expectedMatches = Object.entries(practice.expected || {}).every(([key, value]) => values[key] === value);
      passed = allFilled && expectedMatches;
    }

    setStatus("running");
    window.setTimeout(() => {
      if (passed) {
        setStatus("success");
        onComplete();
      } else {
        setStatus("error");
      }
    }, 650);
  };

  return (
    <section className="practice-panel" aria-labelledby="practice-title">
      <div className="practice-heading">
        <div>
          <span className="section-label">实践环境 · 模拟模式</span>
          <h2 id="practice-title">现在轮到你</h2>
        </div>
        <span className="sandbox-status"><span />本地沙盒</span>
      </div>
      <p className="practice-prompt">{practice.prompt}</p>

      {practice.type === "builder" ? (
        <BuilderFields fields={practice.fields} values={values} setValues={setValues} />
      ) : (
        <div className={`practice-options ${practice.type === "multi" ? "is-multi" : ""}`}>
          {practice.options.map((option) => {
            const selected = practice.type === "multi" ? selection.includes(option.id) : selection === option.id;
            return (
              <button
                key={option.id}
                className={selected ? "is-selected" : ""}
                onClick={() => toggleSelection(option.id)}
                aria-pressed={selected}
              >
                <span className="option-indicator">{selected ? <Check size={14} /> : null}</span>
                <span><strong>{option.label}</strong><small>{option.detail}</small></span>
              </button>
            );
          })}
        </div>
      )}

      <div className="command-preview">
        <Terminal size={15} />
        <code>{commandPreview}</code>
      </div>

      <div className="practice-actions">
        <div className={`feedback-message is-${status}`} aria-live="polite">
          {status === "idle" ? "完成选择后运行检查。" : null}
          {status === "running" ? "Hermes 正在检查你的方案…" : null}
          {status === "error" ? practice.hint : null}
          {status === "success" ? <><CheckCircle2 size={16} />{practice.success}</> : null}
        </div>
        <button className="primary-button" onClick={evaluate} disabled={status === "running"}>
          <Play size={15} fill="currentColor" />
          {status === "success" ? "重新检查" : "运行检查"}
        </button>
      </div>
    </section>
  );
}

function CourseView({ lesson, lessonIndex, completed, onComplete, onNavigate }) {
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <div className="course-view">
      <section className="lesson-intro">
        <div className="lesson-kicker">
          <span>第 {lesson.number} 课</span>
          <span>{lesson.duration}</span>
        </div>
        <h1>{lesson.shortTitle}</h1>
        <p>{lesson.summary}</p>
        <div className="objective-line"><ShieldCheck size={17} /><span>{lesson.objective}</span></div>
      </section>

      <TracePanel lesson={lesson} />

      <section className="guided-section">
        <div className="step-tabs" role="tablist" aria-label="教程步骤">
          {lesson.steps.map((step, index) => (
            <button
              key={step.title}
              role="tab"
              aria-selected={stepIndex === index}
              onClick={() => setStepIndex(index)}
              className={stepIndex === index ? "is-active" : ""}
            >
              <span>{index + 1}</span>{step.title}
            </button>
          ))}
        </div>
        <div className="step-content" role="tabpanel">
          <span>0{stepIndex + 1}</span>
          <div>
            <h2>{lesson.steps[stepIndex].title}</h2>
            <p>{lesson.steps[stepIndex].body}</p>
          </div>
          <button
            className="icon-button"
            aria-label="下一教程步骤"
            onClick={() => setStepIndex((current) => Math.min(current + 1, lesson.steps.length - 1))}
            disabled={stepIndex === lesson.steps.length - 1}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <PracticePanel
        key={lesson.id}
        lesson={lesson}
        isCompleted={completed.includes(lesson.id)}
        onComplete={() => onComplete(lesson.id)}
      />

      <div className="lesson-footer-nav">
        <button className="text-button" onClick={() => onNavigate(lessonIndex - 1)} disabled={lessonIndex === 0}>
          <ArrowLeft size={15} />上一课
        </button>
        <a href={lesson.docs} target="_blank" rel="noreferrer">查看官方文档<ExternalLink size={14} /></a>
        <button className="primary-button" onClick={() => onNavigate(lessonIndex + 1)} disabled={lessonIndex === lessons.length - 1}>
          下一课<ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function ProgressRail({ lesson, completed, onReset }) {
  const value = Math.round((completed.length / lessons.length) * 100);
  const completedCurrent = completed.includes(lesson.id);
  return (
    <aside className="progress-rail">
      <span className="section-label">总掌握度</span>
      <ProgressRing value={value} />
      <div className="level-copy">
        <strong>{value === 100 ? "Hermes 实践者" : value >= 50 ? "工作流构建者" : "入门探索者"}</strong>
        <span>{completed.length} 个课程已掌握</span>
      </div>

      <div className="rail-divider" />
      <span className="section-label">本节检查点</span>
      <div className="checkpoint-list">
        {lesson.checkpoints.map((checkpoint, index) => {
          const done = completedCurrent || index < 2;
          return (
            <div key={checkpoint} className={done ? "is-done" : ""}>
              {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              <span>{checkpoint}</span>
            </div>
          );
        })}
      </div>

      <div className="rail-divider" />
      <span className="section-label">即时反馈</span>
      <p className="rail-feedback">
        {completedCurrent
          ? "本节练习已通过。可以进入下一课，或重新运行沙盒巩固判断。"
          : "你已经完成概念阅读。通过实践检查后，本节会计入总掌握度。"}
      </p>

      <button className="reset-button" onClick={onReset}><RefreshCcw size={14} />重置本地进度</button>
    </aside>
  );
}

function ResearchView() {
  const [filter, setFilter] = useState("all");
  const shown = repositories.filter((repo) => {
    if (filter === "all") return true;
    if (filter === "official") return repo.role.includes("官方");
    return !repo.role.includes("官方");
  });

  return (
    <div className="research-view">
      <section className="research-header">
        <img src="/hermes-banner.png" alt="Hermes Agent 官方项目横幅" />
        <div>
          <h1>Hermes 开源生态研究</h1>
          <p>以官方核心仓库为事实主线，辅以界面、生态索引、中文指南和自进化示例。检索日期：2026-07-29。</p>
        </div>
      </section>

      <div className="research-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="资源筛选">
          {[{ id: "all", label: "全部" }, { id: "official", label: "官方" }, { id: "community", label: "社区" }].map((item) => (
            <button key={item.id} className={filter === item.id ? "is-active" : ""} onClick={() => setFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <span>{shown.length} 个已核验项目</span>
      </div>

      <div className="repo-list">
        {shown.map((repo) => (
          <article className="repo-card" key={repo.name}>
            <div className="repo-heading">
              <div>
                <span>{repo.role}</span>
                <h2>{repo.name}</h2>
              </div>
              <a className="icon-button" href={repo.url} target="_blank" rel="noreferrer" aria-label={`打开 ${repo.name}`}>
                <ExternalLink size={17} />
              </a>
            </div>
            <p className="repo-idea">{repo.idea}</p>
            <dl>
              <div><dt>设计理念</dt><dd>{repo.design}</dd></div>
              <div><dt>主要特性</dt><dd>{repo.features.join(" · ")}</dd></div>
              <div><dt>技术</dt><dd>{repo.language}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <div className="research-caveat">
        <ShieldCheck size={18} />
        <p>社区项目用于补充界面与实践视角，不视为官方兼容性承诺。安装 Skill、插件或 MCP 前仍需检查来源、权限和当前版本。</p>
      </div>
    </div>
  );
}

function ArchitectureView() {
  return (
    <div className="architecture-view">
      <section className="architecture-header">
        <span className="section-label">Solution Design</span>
        <h1>从资料到可操作练习</h1>
        <p>这个成品刻意不直接连接真实 Hermes。练习先在浏览器状态机中完成，学习者理解风险后再进入真实 CLI。</p>
      </section>

      <section className="flow-diagram" aria-label="系统数据流">
        <div><GitFork size={20} /><strong>GitHub / Docs</strong><span>已核验事实源</span></div>
        <ArrowRight size={18} />
        <div><FileCode2 size={20} /><strong>Course Data</strong><span>结构化课程与练习</span></div>
        <ArrowRight size={18} />
        <div><Bot size={20} /><strong>Learning Engine</strong><span>判定、反馈、掌握度</span></div>
        <ArrowRight size={18} />
        <div><CheckCircle2 size={20} /><strong>Local Progress</strong><span>版本化浏览器存储</span></div>
      </section>

      <section className="architecture-grid">
        {architectureLayers.map((layer, index) => (
          <article key={layer.title}>
            <span>0{index + 1}</span>
            <h2>{layer.title}</h2>
            <p>{layer.detail}</p>
          </article>
        ))}
      </section>

      <section className="architecture-table-section">
        <h2>技术架构与边界</h2>
        <div className="architecture-table">
          <div><strong>界面</strong><span>React 19、Vite、Lucide icons、响应式 CSS</span></div>
          <div><strong>数据</strong><span>静态课程模块；没有远程数据库或账号系统</span></div>
          <div><strong>状态</strong><span>单页状态机 + localStorage v1 schema</span></div>
          <div><strong>安全</strong><span>所有命令均为模拟展示；外链明确跳转到来源</span></div>
          <div><strong>扩展点</strong><span>可替换课程数据、增加题型、接入后端 LMS</span></div>
          <div><strong>取舍</strong><span>真实感稍低，但零配置、可重复且不会污染 Hermes 环境</span></div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [initial] = useState(() => readProgress());
  const [activeLesson, setActiveLesson] = useState(Math.min(initial.activeLesson, lessons.length - 1));
  const [completed, setCompleted] = useState(initial.completed);
  const [view, setView] = useState("course");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lesson = lessons[activeLesson];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completed, activeLesson }));
  }, [completed, activeLesson]);

  const completeLesson = (id) => {
    setCompleted((current) => current.includes(id) ? current : [...current, id]);
  };

  const navigateLesson = (index) => {
    if (index < 0 || index >= lessons.length) return;
    setActiveLesson(index);
    setView("course");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetProgress = () => {
    if (!window.confirm("确定要清除这个浏览器中的课程进度吗？")) return;
    setCompleted([]);
    setActiveLesson(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="app-shell">
      <CourseSidebar
        activeIndex={activeLesson}
        completed={completed}
        onSelect={navigateLesson}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-shell">
        <AppTopbar
          view={view}
          setView={setView}
          lesson={lesson}
          saved
          onOpenMenu={() => setSidebarOpen(true)}
        />
        <div className="main-scroll">
          {view === "course" ? (
            <CourseView
              key={lesson.id}
              lesson={lesson}
              lessonIndex={activeLesson}
              completed={completed}
              onComplete={completeLesson}
              onNavigate={navigateLesson}
            />
          ) : null}
          {view === "research" ? <ResearchView /> : null}
          {view === "architecture" ? <ArchitectureView /> : null}
        </div>
      </main>
      {view === "course" ? <ProgressRail lesson={lesson} completed={completed} onReset={resetProgress} /> : null}
    </div>
  );
}
