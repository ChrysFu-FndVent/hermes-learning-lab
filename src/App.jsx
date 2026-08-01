import { useEffect, useState } from "react";
import {
  AlertTriangle,
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
  FlaskConical,
  GitFork,
  GraduationCap,
  Layers3,
  ListChecks,
  Menu,
  Play,
  RefreshCcw,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import { architectureLayers, lessons, phases, repositories } from "./data";

const STORAGE_KEY = "hermes-learning-lab-progress-v2";
const LEGACY_STORAGE_KEY = "hermes-learning-lab-progress-v1";

function readProgress() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current?.version === 2 && Array.isArray(current.completed)) return current;

    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (legacy?.version === 1 && Array.isArray(legacy.completed)) {
      return { version: 2, completed: legacy.completed, activeLesson: legacy.activeLesson || 0, diagnostics: {} };
    }
  } catch {
    // Invalid local data must never block the course.
  }
  return { version: 2, completed: [], activeLesson: 0, diagnostics: {} };
}

function ProgressRing({ value }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="progress-ring" aria-label={`总掌握度 ${value}%`}>
      <svg viewBox="0 0 92 92" aria-hidden="true">
        <circle className="progress-ring-track" cx="46" cy="46" r={radius} />
        <circle className="progress-ring-value" cx="46" cy="46" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
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
          <div><strong>HERMES LAB</strong><span>交互式系统课程</span></div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="关闭课程导航"><X size={18} /></button>
        </div>

        <div className="course-progress-copy"><span>学习进度</span><strong>{completed.length} / {lessons.length}</strong></div>
        <div className="linear-progress" aria-hidden="true"><span style={{ width: `${(completed.length / lessons.length) * 100}%` }} /></div>

        <nav className="lesson-nav" aria-label="课程目录">
          {phases.map((phase) => {
            const phaseLessons = lessons.filter((lesson) => lesson.phaseId === phase.id);
            const phaseDone = phaseLessons.filter((lesson) => completed.includes(lesson.id)).length;
            return (
              <div className="phase-group" key={phase.id}>
                <div className="phase-heading">
                  <span>阶段 {phase.number} · {phase.title}</span>
                  <small>{phaseDone}/{phaseLessons.length}</small>
                </div>
                {phaseLessons.map((lesson) => {
                  const index = lessons.findIndex((item) => item.id === lesson.id);
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
                      <span><strong>{lesson.title}</strong><small>{lesson.duration}</small></span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="source-note"><GitFork size={14} /><span>官方资料 + AI-For-Beginners 教学法</span></div>
      </aside>
    </>
  );
}

function AppTopbar({ view, setView, lesson, phase, onOpenMenu }) {
  const tabs = [
    { id: "course", label: "课程", icon: BookOpen },
    { id: "research", label: "资料研究", icon: GitFork },
    { id: "architecture", label: "教学架构", icon: Layers3 },
  ];

  return (
    <header className="app-topbar">
      <div className="topbar-context">
        <button className="icon-button menu-button" onClick={onOpenMenu} aria-label="打开课程导航"><Menu size={19} /></button>
        <span>{view === "course" ? `${phase.title} / ${lesson.number} ${lesson.title}` : "Hermes Learning Lab"}</span>
      </div>
      <div className="view-tabs" role="tablist" aria-label="视图">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} role="tab" aria-selected={view === tab.id} className={view === tab.id ? "is-active" : ""} onClick={() => setView(tab.id)}>
              <Icon size={15} /><span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <span className="save-state"><span />本地自动保存</span>
    </header>
  );
}

function TracePanel({ lesson }) {
  return (
    <div className="trace-strip" aria-label="Hermes 回合轨迹">
      {lesson.trace.map((item, index) => (
        <div key={item}>
          <span>{index + 1}</span><p>{item}</p>{index < lesson.trace.length - 1 ? <ArrowRight size={14} /> : null}
        </div>
      ))}
    </div>
  );
}

function PreQuiz({ lesson, result, onResult }) {
  const [selection, setSelection] = useState("");
  const [revealed, setRevealed] = useState(Boolean(result));
  const passed = selection === lesson.preQuiz.correct;

  const submit = () => {
    if (!selection) return;
    setRevealed(true);
    onResult(passed);
  };

  return (
    <section className="diagnostic-panel" aria-labelledby="diagnostic-title">
      <div className="diagnostic-heading">
        <div><span className="section-label">课前诊断</span><h2 id="diagnostic-title">先判断，再开始</h2></div>
        <span className={`diagnostic-state ${result ? "is-done" : ""}`}>{result ? "已记录" : "不计分"}</span>
      </div>
      <p>{lesson.preQuiz.prompt}</p>
      <div className="diagnostic-options">
        {lesson.preQuiz.options.map((item) => (
          <button key={item.id} className={selection === item.id ? "is-selected" : ""} onClick={() => { setSelection(item.id); setRevealed(false); }} aria-pressed={selection === item.id}>
            <span>{selection === item.id ? <Check size={13} /> : null}</span>
            <strong>{item.label}</strong><small>{item.detail}</small>
          </button>
        ))}
      </div>
      <div className="diagnostic-footer">
        <span className={revealed ? (passed ? "is-success" : "is-review") : ""} aria-live="polite">
          {revealed ? (passed ? `判断正确。${lesson.preQuiz.explanation}` : `建议带着问题学习：${lesson.preQuiz.explanation}`) : "用于激活已有知识，不影响课程解锁。"}
        </span>
        <button className="text-button diagnostic-submit" onClick={submit} disabled={!selection}>提交判断<ArrowRight size={14} /></button>
      </div>
    </section>
  );
}

function BuilderFields({ fields, values, setValues }) {
  return (
    <div className="builder-fields">
      {fields.map((field) => (
        <label key={field.id}>
          <span>{field.label}</span>
          {field.type === "select" ? (
            <select value={values[field.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}>
              <option value="">请选择</option>
              {field.options.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          ) : (
            <input value={values[field.id] || ""} placeholder={field.placeholder} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} />
          )}
        </label>
      ))}
    </div>
  );
}

function LabBrief({ lab }) {
  return (
    <section className="lab-brief" aria-labelledby="lab-title">
      <div className="lab-title-row"><FlaskConical size={18} /><div><span className="section-label">可执行实验</span><h2 id="lab-title">{lab.task}</h2></div></div>
      <div className="lab-anatomy">
        <div><strong>输入</strong><p>{lab.input}</p></div>
        <div><strong>操作步骤</strong><ol>{lab.procedure.map((item) => <li key={item}>{item}</li>)}</ol></div>
        <div><strong>成功标准</strong><ul>{lab.successCriteria.map((item) => <li key={item}><CheckCircle2 size={14} />{item}</li>)}</ul></div>
      </div>
      <p className="lab-safety"><ShieldCheck size={15} />本平台只模拟关键决策；真实命令请在隔离练习环境中执行。</p>
    </section>
  );
}

function PracticePanel({ lesson, isCompleted, onComplete }) {
  const practice = lesson.practice;
  const [selection, setSelection] = useState(practice.type === "multi" ? [] : "");
  const [values, setValues] = useState({});
  const [status, setStatus] = useState(isCompleted ? "success" : "idle");
  const commandPreview = practice.type === "builder" ? practice.commandTemplate(values) : lesson.command;

  const toggleSelection = (id) => {
    if (practice.type === "multi") setSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    else setSelection(id);
    if (status === "error") setStatus("idle");
  };

  const evaluate = () => {
    let passed = false;
    if (practice.type === "choice") passed = selection === practice.correct;
    if (practice.type === "multi") passed = [...selection].sort().join("|") === [...practice.correct].sort().join("|");
    if (practice.type === "builder") {
      const allFilled = practice.fields.every((field) => String(values[field.id] || "").trim());
      const expectedMatches = Object.entries(practice.expected || {}).every(([key, value]) => values[key] === value);
      passed = allFilled && expectedMatches;
    }

    setStatus("running");
    window.setTimeout(() => {
      setStatus(passed ? "success" : "error");
      if (passed) onComplete();
    }, 450);
  };

  return (
    <section className="practice-panel" aria-labelledby="practice-title">
      <div className="practice-heading">
        <div><span className="section-label">课后检查 · 模拟模式</span><h2 id="practice-title">证明你已经掌握</h2></div>
        <span className="sandbox-status"><span />浏览器沙盒</span>
      </div>
      <p className="practice-prompt">{practice.prompt}</p>
      {practice.type === "builder" ? <BuilderFields fields={practice.fields} values={values} setValues={setValues} /> : (
        <div className={`practice-options ${practice.type === "multi" ? "is-multi" : ""}`}>
          {practice.options.map((item) => {
            const selected = practice.type === "multi" ? selection.includes(item.id) : selection === item.id;
            return (
              <button key={item.id} className={selected ? "is-selected" : ""} onClick={() => toggleSelection(item.id)} aria-pressed={selected}>
                <span className="option-indicator">{selected ? <Check size={14} /> : null}</span>
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
              </button>
            );
          })}
        </div>
      )}
      <div className="command-preview"><Terminal size={15} /><code>{commandPreview}</code></div>
      <div className="practice-actions">
        <div className={`feedback-message is-${status}`} aria-live="polite">
          {status === "idle" ? "完成选择后运行检查。" : null}
          {status === "running" ? "正在检查你的方案…" : null}
          {status === "error" ? <><AlertTriangle size={15} />{practice.hint}</> : null}
          {status === "success" ? <><CheckCircle2 size={16} />{practice.success}</> : null}
        </div>
        <button className="primary-button" onClick={evaluate} disabled={status === "running"}><Play size={15} fill="currentColor" />{status === "success" ? "重新检查" : "运行检查"}</button>
      </div>
    </section>
  );
}

function LessonReferences({ lesson }) {
  return (
    <section className="lesson-resources">
      <div><strong>本课结论</strong><span>{lesson.takeaways.join(" · ")}</span></div>
      <div><strong>常见问题</strong><span>{lesson.troubleshooting}</span></div>
      <div className="reference-links"><strong>官方资料</strong><span>{lesson.references.map((ref) => <a key={ref.url} href={ref.url} target="_blank" rel="noreferrer">{ref.label}<ExternalLink size={12} /></a>)}</span></div>
    </section>
  );
}

function CourseView({ lesson, lessonIndex, completed, diagnostic, onDiagnose, onComplete, onNavigate }) {
  const [stepIndex, setStepIndex] = useState(0);
  return (
    <div className="course-view">
      <section className="lesson-intro">
        <div className="lesson-kicker"><span>第 {lesson.number} 课</span><span>{lesson.level}</span><span>{lesson.duration}</span></div>
        <h1>{lesson.shortTitle}</h1>
        <p>{lesson.summary}</p>
        <div className="objective-line"><ShieldCheck size={17} /><span>{lesson.objective}</span></div>
        <div className="prerequisite-line"><strong>先修</strong>{lesson.prerequisites.map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <PreQuiz lesson={lesson} result={diagnostic} onResult={(passed) => onDiagnose(lesson.id, passed)} />
      <TracePanel lesson={lesson} />

      <section className="guided-section">
        <div className="section-heading-row"><div><span className="section-label">核心讲解</span><h2>建立本课心智模型</h2></div><span>{stepIndex + 1} / {lesson.steps.length}</span></div>
        <div className="step-tabs" role="tablist" aria-label="教程步骤">
          {lesson.steps.map((step, index) => (
            <button key={step.title} role="tab" aria-selected={stepIndex === index} onClick={() => setStepIndex(index)} className={stepIndex === index ? "is-active" : ""}>
              <span>{index + 1}</span>{step.title}
            </button>
          ))}
        </div>
        <div className="step-content" role="tabpanel">
          <span>{String(stepIndex + 1).padStart(2, "0")}</span>
          <div><h2>{lesson.steps[stepIndex].title}</h2><p>{lesson.steps[stepIndex].body}</p></div>
          <button className="icon-button" aria-label="下一教程步骤" onClick={() => setStepIndex((current) => Math.min(current + 1, lesson.steps.length - 1))} disabled={stepIndex === lesson.steps.length - 1}><ArrowRight size={18} /></button>
        </div>
      </section>

      <LabBrief lab={lesson.lab} />
      <PracticePanel key={lesson.id} lesson={lesson} isCompleted={completed.includes(lesson.id)} onComplete={() => onComplete(lesson.id)} />
      <LessonReferences lesson={lesson} />

      <div className="lesson-footer-nav">
        <button className="text-button" onClick={() => onNavigate(lessonIndex - 1)} disabled={lessonIndex === 0}><ArrowLeft size={15} />上一课</button>
        <span>{lesson.number} / {lessons.at(-1).number}</span>
        <button className="primary-button" onClick={() => onNavigate(lessonIndex + 1)} disabled={lessonIndex === lessons.length - 1}>下一课<ArrowRight size={15} /></button>
      </div>
    </div>
  );
}

function ProgressRail({ lesson, completed, diagnostics, onReset }) {
  const value = Math.round((completed.length / lessons.length) * 100);
  const completedCurrent = completed.includes(lesson.id);
  const diagnosticCount = Object.keys(diagnostics).length;
  return (
    <aside className="progress-rail">
      <span className="section-label">总掌握度</span>
      <ProgressRing value={value} />
      <div className="level-copy"><strong>{value === 100 ? "Hermes 工程实践者" : value >= 50 ? "工作流构建者" : "基础探索者"}</strong><span>{completed.length} / {lessons.length} 个课后检查已通过</span></div>
      <div className="rail-metric"><ListChecks size={15} /><span>课前诊断</span><strong>{diagnosticCount}/{lessons.length}</strong></div>

      <div className="rail-divider" />
      <span className="section-label">本节检查点</span>
      <div className="checkpoint-list">
        {lesson.checkpoints.map((checkpoint, index) => {
          const done = completedCurrent || (Boolean(diagnostics[lesson.id]) && index === 0);
          return <div key={checkpoint} className={done ? "is-done" : ""}>{done ? <CheckCircle2 size={16} /> : <Circle size={16} />}<span>{checkpoint}</span></div>;
        })}
      </div>

      <div className="rail-divider" />
      <span className="section-label">学习反馈</span>
      <p className="rail-feedback">{completedCurrent ? "课后检查已通过。建议在真实隔离环境完成实验成功标准后再进入下一阶段。" : diagnostics[lesson.id] === "review" ? "课前诊断发现待补知识。完成核心讲解与实验后，用课后检查验证掌握度。" : "先完成课前诊断，再依次学习概念、实验和课后检查。"}</p>
      <button className="reset-button" onClick={onReset}><RefreshCcw size={14} />重置本地进度</button>
    </aside>
  );
}

function ResearchView() {
  const [filter, setFilter] = useState("all");
  const shown = repositories.filter((repo) => filter === "all" || (filter === "official" ? repo.role.includes("官方") : !repo.role.includes("官方")));
  return (
    <div className="research-view">
      <section className="research-header">
        <img src="/hermes-banner.png" alt="Hermes Agent 官方项目横幅" />
        <div><h1>Hermes 技术与教学资料</h1><p>以 Hermes 官方文档和模型卡为事实主线，使用 AI-For-Beginners 的 Setup、诊断、实验和复习结构组织课程。核验日期：2026-08-02。</p></div>
      </section>
      <div className="research-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="资源筛选">
          {[{ id: "all", label: "全部" }, { id: "official", label: "官方" }, { id: "community", label: "参考" }].map((item) => <button key={item.id} className={filter === item.id ? "is-active" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}
        </div>
        <span>{shown.length} 个已核验来源</span>
      </div>
      <div className="repo-list">
        {shown.map((repo) => (
          <article className="repo-card" key={repo.name}>
            <div className="repo-heading"><div><span>{repo.role}</span><h2>{repo.name}</h2></div><a className="icon-button" href={repo.url} target="_blank" rel="noreferrer" aria-label={`打开 ${repo.name}`}><ExternalLink size={17} /></a></div>
            <p className="repo-idea">{repo.idea}</p>
            <dl><div><dt>设计理念</dt><dd>{repo.design}</dd></div><div><dt>主要特性</dt><dd>{repo.features.join(" · ")}</dd></div><div><dt>技术</dt><dd>{repo.language}</dd></div></dl>
          </article>
        ))}
      </div>
      <div className="research-caveat"><ShieldCheck size={18} /><p>社区资料只补充教学与实践视角，不代表官方兼容性。命令、配置键和模型参数最终以当前官方文档与模型卡为准。</p></div>
    </div>
  );
}

function ArchitectureView() {
  return (
    <div className="architecture-view">
      <section className="architecture-header"><span className="section-label">Curriculum Design</span><h1>从资料到可验证学习闭环</h1><p>借鉴 AI-For-Beginners 的渐进课程和低风险反馈：每课都经历诊断、讲解、实验、成功标准、课后检查与延伸资料。</p></section>
      <section className="learning-loop" aria-label="教学闭环">
        {[{ icon: GraduationCap, label: "课前诊断", copy: "激活已有知识" }, { icon: BookOpen, label: "核心讲解", copy: "建立心智模型" }, { icon: FlaskConical, label: "可执行实验", copy: "按成功标准实践" }, { icon: CheckCircle2, label: "课后检查", copy: "反馈并记录掌握" }].map((item, index) => {
          const Icon = item.icon;
          return <div key={item.label}><span>{index + 1}</span><Icon size={20} /><strong>{item.label}</strong><small>{item.copy}</small></div>;
        })}
      </section>
      <section className="architecture-grid">
        {architectureLayers.map((layer, index) => <article key={layer.title}><span>0{index + 1}</span><h2>{layer.title}</h2><p>{layer.detail}</p></article>)}
      </section>
      <section className="architecture-table-section">
        <h2>技术架构与边界</h2>
        <div className="architecture-table">
          <div><strong>内容</strong><span>12 课 / 4 阶段；官方资料链接到课，不把时效性命令埋在长文中</span></div>
          <div><strong>交互</strong><span>课前诊断 + 四步讲解 + 实验说明 + 课后检查 + 即时反馈</span></div>
          <div><strong>状态</strong><span>localStorage v2；兼容迁移原 v1 完成记录</span></div>
          <div><strong>安全</strong><span>命令均为模拟展示；不访问 Shell、~/.hermes、凭据或外部消息平台</span></div>
          <div><strong>响应式</strong><span>桌面三栏、平板双栏、手机课程抽屉；保持同一学习顺序</span></div>
          <div><strong>扩展</strong><span>后续可接入真实隔离实验 runner、账号同步、教师看板与版本化内容更新</span></div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [initial] = useState(() => readProgress());
  const [activeLesson, setActiveLesson] = useState(Math.min(initial.activeLesson, lessons.length - 1));
  const [completed, setCompleted] = useState(initial.completed.filter((id) => lessons.some((lesson) => lesson.id === id)));
  const [diagnostics, setDiagnostics] = useState(initial.diagnostics || {});
  const [view, setView] = useState("course");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lesson = lessons[activeLesson];
  const phase = phases.find((item) => item.id === lesson.phaseId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, completed, activeLesson, diagnostics }));
  }, [completed, activeLesson, diagnostics]);

  const navigateLesson = (index) => {
    if (index < 0 || index >= lessons.length) return;
    setActiveLesson(index);
    setView("course");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetProgress = () => {
    if (!window.confirm("确定清除这个浏览器中的课程进度和诊断记录吗？")) return;
    setCompleted([]);
    setDiagnostics({});
    setActiveLesson(0);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  };

  return (
    <div className="app-shell">
      <CourseSidebar activeIndex={activeLesson} completed={completed} onSelect={navigateLesson} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-shell">
        <AppTopbar view={view} setView={setView} lesson={lesson} phase={phase} onOpenMenu={() => setSidebarOpen(true)} />
        <div className="main-scroll">
          {view === "course" ? <CourseView key={lesson.id} lesson={lesson} lessonIndex={activeLesson} completed={completed} diagnostic={diagnostics[lesson.id]} onDiagnose={(id, passed) => setDiagnostics((current) => ({ ...current, [id]: passed ? "correct" : "review" }))} onComplete={(id) => setCompleted((current) => current.includes(id) ? current : [...current, id])} onNavigate={navigateLesson} /> : null}
          {view === "research" ? <ResearchView /> : null}
          {view === "architecture" ? <ArchitectureView /> : null}
        </div>
      </main>
      {view === "course" ? <ProgressRail lesson={lesson} completed={completed} diagnostics={diagnostics} onReset={resetProgress} /> : null}
    </div>
  );
}
