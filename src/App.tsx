import { useMemo, useState } from "react";

type Page =
  | "inicio"
  | "transacoes"
  | "contas"
  | "cartoes"
  | "revisar"
  | "planejamento"
  | "relatorios"
  | "automacoes"
  | "configuracoes";

type Transaction = {
  id: number;
  title: string;
  detail: string;
  value: number;
  date: string;
  category: string;
  account: string;
  status: "confirmada" | "pendente" | "revisar";
  icon: string;
  kind?: "transferencia" | "receita" | "despesa";
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const transactionsSeed: Transaction[] = [
  {
    id: 1,
    title: "Salário · Nuvem Labs",
    detail: "Pix recebido",
    value: 12850,
    date: "03 jun",
    category: "Renda",
    account: "Itaú",
    status: "confirmada",
    icon: "briefcase",
    kind: "receita",
  },
  {
    id: 2,
    title: "Casa Bauducco",
    detail: "Crédito · Nubank •• 4582",
    value: -42.9,
    date: "Hoje, 09:42",
    category: "Alimentação",
    account: "Nubank",
    status: "confirmada",
    icon: "coffee",
    kind: "despesa",
  },
  {
    id: 3,
    title: "Uber",
    detail: "Crédito · Itaú •• 9012",
    value: -28.47,
    date: "Hoje, 08:15",
    category: "Transporte",
    account: "Itaú",
    status: "pendente",
    icon: "car",
    kind: "despesa",
  },
  {
    id: 4,
    title: "Zaffari",
    detail: "Débito · Inter",
    value: -286.32,
    date: "Ontem, 18:20",
    category: "Mercado",
    account: "Inter",
    status: "confirmada",
    icon: "bag",
    kind: "despesa",
  },
  {
    id: 5,
    title: "Academia Velocity",
    detail: "Crédito · Nubank •• 4582",
    value: -149.9,
    date: "Ontem, 07:10",
    category: "Saúde",
    account: "Nubank",
    status: "confirmada",
    icon: "heart",
    kind: "despesa",
  },
  {
    id: 6,
    title: "Reserva de emergência",
    detail: "Transferência entre suas contas",
    value: -1200,
    date: "10 jun",
    category: "Transferência",
    account: "Itaú → Inter",
    status: "confirmada",
    icon: "swap",
    kind: "transferencia",
  },
  {
    id: 7,
    title: "Netflix.com",
    detail: "Crédito · Nubank •• 4582",
    value: -55.9,
    date: "09 jun",
    category: "Assinaturas",
    account: "Nubank",
    status: "revisar",
    icon: "play",
    kind: "despesa",
  },
  {
    id: 8,
    title: "Farmácia São João",
    detail: "Crédito · Itaú •• 9012",
    value: -83.7,
    date: "08 jun",
    category: "Saúde",
    account: "Itaú",
    status: "confirmada",
    icon: "plus",
    kind: "despesa",
  },
  {
    id: 9,
    title: "Restaurante Nomo",
    detail: "Crédito · Nubank •• 4582",
    value: -187.6,
    date: "07 jun",
    category: "Alimentação",
    account: "Nubank",
    status: "confirmada",
    icon: "fork",
    kind: "despesa",
  },
  {
    id: 10,
    title: "Freela Estúdio Norte",
    detail: "Pix recebido",
    value: 1850,
    date: "06 jun",
    category: "Renda extra",
    account: "Itaú",
    status: "confirmada",
    icon: "sparkles",
    kind: "receita",
  },
];

const nav: { id: Page; label: string; icon: string }[] = [
  { id: "inicio", label: "Início", icon: "home" },
  { id: "transacoes", label: "Movimentações", icon: "list" },
  { id: "contas", label: "Contas", icon: "bank" },
  { id: "cartoes", label: "Cartões", icon: "card" },
  { id: "revisar", label: "Revisar", icon: "check" },
  { id: "planejamento", label: "Planejamento", icon: "target" },
  { id: "relatorios", label: "Relatórios", icon: "chart" },
  { id: "automacoes", label: "Automações", icon: "wand" },
];

const iconPaths: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v10h13V10M9 20v-6h6v6" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  bank: (
    <>
      <path d="m3 9 9-5 9 5" />
      <path d="M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  check: (
    <>
      <path d="M20 11.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
      <path d="m9 11 3 3L21 5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />
    </>
  ),
  wand: (
    <>
      <path d="m15 4 5 5L8 21l-5-5Z" />
      <path d="m6 4 .7 1.8L8.5 6.5l-1.8.7L6 9l-.7-1.8-1.8-.7 1.8-.7ZM18 14l.7 1.8 1.8.7-1.8.7L18 19l-.7-1.8-1.8-.7 1.8-.7Z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="m9 18 6-6-6-6" />,
  down: <path d="m6 9 6 6 6-6" />,
  up: <path d="m18 15-6-6-6 6" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M17 10h1a3 3 0 0 1 0 6h-2M7 4v2m4-2v2" />
    </>
  ),
  car: (
    <>
      <path d="m5 16-1 3m15-3 1 3M4 16h16V9H4Z" />
      <path d="m6 9 2-4h8l2 4M7 13h.01M17 13h.01" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </>
  ),
  heart: (
    <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 22l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  ),
  swap: (
    <>
      <path d="M7 7h13l-3-3m3 3-3 3M17 17H4l3 3m-3-3 3-3" />
    </>
  ),
  play: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3Z" />
    </>
  ),
  fork: (
    <>
      <path d="M7 3v8m-3-8v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18m0-18c3 2 4 5 4 9h-4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V4h8v3m-13 5h18M10 12v2h4v-2" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7M10 11v6m4-6v6" />
    </>
  ),
  edit: (
    <>
      <path d="m14 5 5 5L8 21H3v-5Z" />
      <path d="m12 7 5 5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 20h16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  undo: (
    <>
      <path d="M9 8 4 12l5 4" />
      <path d="M5 12h8a6 6 0 0 1 6 6" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name] || iconPaths.info}
    </svg>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span className="logo-mark">
        <i />
        <i />
        <i />
      </span>
      <span>
        Finance
        <br />
        <b>Tracker</b>
      </span>
    </div>
  );
}

function Status({ type }: { type: Transaction["status"] }) {
  const labels = { confirmada: "Confirmada", pendente: "Pendente", revisar: "Revisar" };
  return <span className={`status ${type}`}>{labels[type]}</span>;
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`pill ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function TransactionRow({
  item,
  onClick,
  showDate = true,
}: {
  item: Transaction;
  onClick: () => void;
  showDate?: boolean;
}) {
  return (
    <button className="transaction-row" onClick={onClick}>
      <span
        className={`tx-icon ${item.value > 0 ? "income" : item.kind === "transferencia" ? "transfer" : ""}`}
      >
        <Icon name={item.icon} />
      </span>
      <span className="tx-main">
        <b>{item.title}</b>
        <small>{item.detail}</small>
      </span>
      {showDate && <span className="tx-date">{item.date}</span>}
      <span className="tx-category">{item.category}</span>
      <span className={`tx-value ${item.value > 0 ? "positive" : ""}`}>
        {item.kind === "transferencia" ? money(Math.abs(item.value)) : money(item.value)}
      </span>
      <Status type={item.status} />
      <Icon name="arrow" size={16} />
    </button>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onAction}>
          {action}
          <Icon name="arrow" size={16} />
        </button>
      )}
    </div>
  );
}

function Sparkline({ values, color = "#b8ff63" }: { values: number[]; color?: string }) {
  const max = Math.max(...values),
    min = Math.min(...values);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${42 - ((v - min) / (max - min || 1)) * 34}`)
    .join(" ");
  return (
    <svg className="sparkline" viewBox="0 0 100 46" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
      {values.map((v, i) => (
        <circle
          key={i}
          cx={(i / (values.length - 1)) * 100}
          cy={42 - ((v - min) / (max - min || 1)) * 34}
          r="1.6"
          fill={color}
        />
      ))}
    </svg>
  );
}

function Home({ go, openTx }: { go: (p: Page) => void; openTx: (t: Transaction) => void }) {
  const [period, setPeriod] = useState("Junho");
  const [chartPoint, setChartPoint] = useState(5);
  return (
    <div className="page home-page">
      <header className="page-intro">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h1>Bom dia, Marina.</h1>
          <p>Seu mês está equilibrado — e você guardou mais que em maio.</p>
        </div>
        <div className="period-control">
          <button aria-label="Mês anterior">‹</button>
          <button className="current">
            <Icon name="calendar" size={17} />
            {period}
            <Icon name="down" size={14} />
          </button>
          <button
            onClick={() => setPeriod(period === "Junho" ? "Julho" : "Junho")}
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>
      </header>

      <section className="hero-balance">
        <div className="balance-copy">
          <span className="overline light">
            MOVIMENTO LÍQUIDO{" "}
            <button title="Receitas confirmadas menos despesas confirmadas">
              <Icon name="info" size={14} />
            </button>
          </span>
          <div className="hero-amount">
            + R$ 6.741<sup>,20</sup>
          </div>
          <p>
            <span className="delta">
              <Icon name="up" size={13} /> 12,4%
            </span>{" "}
            melhor que no mesmo período de maio
          </p>
          <div className="hero-metrics">
            <button onClick={() => go("transacoes")}>
              <span className="dot income" />
              <small>ENTRADAS CONFIRMADAS</small>
              <b>R$ 14.700,00</b>
            </button>
            <button onClick={() => go("transacoes")}>
              <span className="dot expense" />
              <small>SAÍDAS CONFIRMADAS</small>
              <b>R$ 7.958,80</b>
            </button>
          </div>
        </div>
        <div className="hero-chart" aria-label="Gráfico de movimento acumulado">
          <div className="chart-labels">
            <span>R$ 15 mil</span>
            <span>R$ 10 mil</span>
            <span>R$ 5 mil</span>
            <span>R$ 0</span>
          </div>
          <div className="chart-area">
            {[1, 2, 3].map((i) => (
              <i key={i} className={`grid-line g${i}`} />
            ))}
            <svg viewBox="0 0 600 190" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#b8ff63" stopOpacity=".28" />
                  <stop offset="1" stopColor="#b8ff63" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 168 C45 165,65 138,105 145 S165 102,205 112 S270 82,310 91 S370 58,420 68 S480 42,520 48 S575 17,600 23 L600 190 L0 190Z"
                fill="url(#heroFill)"
              />
              <path
                d="M0 168 C45 165,65 138,105 145 S165 102,205 112 S270 82,310 91 S370 58,420 68 S480 42,520 48 S575 17,600 23"
                fill="none"
                stroke="#b8ff63"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                aria-label={`Explorar semana ${n + 1}`}
                onClick={() => setChartPoint(n)}
                className={`chart-hit h${n} ${chartPoint === n ? "selected" : ""}`}
              />
            ))}
            <div
              className="chart-tooltip"
              style={{ left: `${8 + chartPoint * 14}%`, top: `${76 - chartPoint * 9}%` }}
            >
              <small>{chartPoint + 1 + 8} JUN</small>
              <b>{money(3820 + chartPoint * 486.87)}</b>
            </div>
            <div className="x-labels">
              <span>1 jun</span>
              <span>7 jun</span>
              <span>14 jun</span>
              <span>21 jun</span>
              <span>Hoje</span>
            </div>
          </div>
        </div>
        <div className="coverage">
          <span>
            <Icon name="shield" size={16} /> 96% das movimentações estão categorizadas
          </span>
          <span>Atualizado hoje, 10:14</span>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel spending-panel">
          <SectionTitle
            eyebrow="ONDE VOCÊ GASTOU"
            title="R$ 7.958,80"
            action="Ver relatório"
            onAction={() => go("relatorios")}
          />
          <div className="spending-content">
            <div className="donut">
              <div>
                <b>53%</b>
                <span>do total</span>
              </div>
            </div>
            <div className="category-list">
              {[
                ["Moradia", "R$ 2.840,00", "36%", "#caff80"],
                ["Alimentação", "R$ 1.396,20", "18%", "#8a72ff"],
                ["Transporte", "R$ 987,80", "12%", "#ff9b6c"],
                ["Saúde", "R$ 768,40", "10%", "#63d8c0"],
              ].map((c) => (
                <button key={c[0]} onClick={() => go("transacoes")}>
                  <i style={{ background: c[3] }} />
                  <span>
                    <b>{c[0]}</b>
                    <small>{c[2]} do total</small>
                  </span>
                  <strong>{c[1]}</strong>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="panel attention-panel">
          <SectionTitle
            eyebrow="PRECISA DE VOCÊ"
            title="3 itens para revisar"
            action="Revisar tudo"
            onAction={() => go("revisar")}
          />
          <button className="attention-card" onClick={() => go("revisar")}>
            <span className="attention-icon">
              <Icon name="check" />
            </span>
            <span>
              <b>Possível movimentação duplicada</b>
              <small>Netflix · R$ 55,90 · 9 jun</small>
            </span>
            <span className="badge">ALTA</span>
            <Icon name="arrow" size={17} />
          </button>
          <button className="attention-card" onClick={() => go("contas")}>
            <span className="attention-icon warning">
              <Icon name="bank" />
            </span>
            <span>
              <b>Inter precisa ser reconectado</b>
              <small>Última atualização há 3 dias</small>
            </span>
            <Icon name="arrow" size={17} />
          </button>
          <div className="attention-footer">
            <span>
              <i /> 2 resolvidos esta semana
            </span>
            <button onClick={() => go("revisar")}>Ver histórico</button>
          </div>
        </section>

        <section className="panel accounts-glance">
          <SectionTitle
            eyebrow="CONTAS E CARTÕES"
            title="Tudo em um só lugar"
            action="Gerenciar"
            onAction={() => go("contas")}
          />
          <div className="account-summary-row">
            <span className="bank-logo itau">i</span>
            <span>
              <b>Conta Itaú</b>
              <small>Saldo disponível</small>
            </span>
            <strong>R$ 8.420,16</strong>
            <span className="fresh">ATUALIZADA</span>
          </div>
          <div className="account-summary-row">
            <span className="bank-logo nu">nu</span>
            <span>
              <b>Nubank Platinum</b>
              <small>Fatura estimada · fecha em 6 dias</small>
            </span>
            <strong>R$ 2.864,90</strong>
            <span className="usage">
              <i style={{ width: "43%" }} />
            </span>
          </div>
          <div className="total-line">
            <span>Disponível em contas</span>
            <b>R$ 15.430,82</b>
          </div>
        </section>

        <section className="panel plan-glance">
          <SectionTitle
            eyebrow="SEU PLANO"
            title="Metas em movimento"
            action="Planejar"
            onAction={() => go("planejamento")}
          />
          <button className="goal-row" onClick={() => go("planejamento")}>
            <span className="goal-symbol">✦</span>
            <span>
              <b>Viagem para a Patagônia</b>
              <small>R$ 8.600 de R$ 12.000</small>
              <i>
                <em style={{ width: "72%" }} />
              </i>
            </span>
            <strong>72%</strong>
          </button>
          <button className="budget-row" onClick={() => go("planejamento")}>
            <span>
              <b>Orçamento de junho</b>
              <small>R$ 7.958 de R$ 10.500</small>
            </span>
            <span className="mini-ring">76%</span>
          </button>
        </section>
      </div>

      <section className="panel recent">
        <SectionTitle
          eyebrow="ATIVIDADE RECENTE"
          title="Movimentações"
          action="Ver todas"
          onAction={() => go("transacoes")}
        />
        <div className="tx-head">
          <span>DESCRIÇÃO</span>
          <span>DATA</span>
          <span>CATEGORIA</span>
          <span>VALOR</span>
          <span>STATUS</span>
        </div>
        {transactionsSeed.slice(1, 5).map((t) => (
          <TransactionRow key={t.id} item={t} onClick={() => openTx(t)} />
        ))}
      </section>
    </div>
  );
}

function Transactions({
  items,
  openTx,
  add,
}: {
  items: Transaction[];
  openTx: (t: Transaction) => void;
  add: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [advanced, setAdvanced] = useState(false);
  const visible = items.filter(
    (t) =>
      (t.title + t.category + t.account).toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Todas" ||
        (filter === "Entradas"
          ? t.value > 0
          : filter === "Pendentes"
            ? t.status !== "confirmada"
            : t.value < 0 && t.kind !== "transferencia")),
  );
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">MOVIMENTAÇÕES</span>
          <h1>Seu dinheiro, em detalhes.</h1>
          <p>Encontre, entenda e organize cada movimentação.</p>
        </div>
        <button className="primary" onClick={add}>
          <Icon name="plus" size={18} /> Nova movimentação
        </button>
      </header>
      <section className="panel transaction-tools">
        <div className="search-box">
          <Icon name="search" size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, valor ou categoria…"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
        <div className="filter-row">
          {["Todas", "Saídas", "Entradas", "Pendentes"].map((x) => (
            <Pill key={x} active={filter === x} onClick={() => setFilter(x)}>
              {x}
            </Pill>
          ))}
          <button
            className={`filter-button ${advanced ? "active" : ""}`}
            onClick={() => setAdvanced(!advanced)}
          >
            <Icon name="filter" size={17} /> Filtros <span>2</span>
          </button>
          <button className="date-button">
            <Icon name="calendar" size={17} /> 1–15 de junho <Icon name="down" size={14} />
          </button>
        </div>
        {advanced && (
          <div className="advanced-filters">
            <label>
              Instituição
              <select>
                <option>Todas</option>
                <option>Itaú</option>
                <option>Nubank</option>
                <option>Inter</option>
              </select>
            </label>
            <label>
              Conta ou cartão
              <select>
                <option>Todos</option>
                <option>Conta corrente Itaú</option>
                <option>Nubank •• 4582</option>
              </select>
            </label>
            <label>
              Categoria
              <select>
                <option>Todas</option>
                <option>Alimentação</option>
                <option>Transporte</option>
              </select>
            </label>
            <label>
              Forma de pagamento
              <select>
                <option>Todas</option>
                <option>Crédito</option>
                <option>Pix</option>
                <option>Débito</option>
              </select>
            </label>
          </div>
        )}
      </section>
      <div className="transaction-summary">
        <div>
          <span>SAÍDAS CONFIRMADAS</span>
          <b>R$ 7.958,80</b>
        </div>
        <div>
          <span>ENTRADAS CONFIRMADAS</span>
          <b className="green">R$ 14.700,00</b>
        </div>
        <div>
          <span>PENDENTE</span>
          <b>R$ 184,37</b>
        </div>
        <div className="summary-note">
          <Icon name="info" size={16} /> Transferências próprias e pagamentos de fatura não entram
          nas despesas.
        </div>
      </div>
      <section className="panel transactions-list">
        <div className="list-date">
          <span>HOJE, 15 DE JUNHO</span>
          <span>
            3 movimentações · <b>- R$ 71,37</b>
          </span>
        </div>
        {visible.length ? (
          visible.map((t) => <TransactionRow key={t.id} item={t} onClick={() => openTx(t)} />)
        ) : (
          <div className="empty-state">
            <span>
              <Icon name="search" size={26} />
            </span>
            <h3>Nada por aqui</h3>
            <p>Tente remover alguns filtros ou buscar por outro termo.</p>
            <button
              onClick={() => {
                setSearch("");
                setFilter("Todas");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function Accounts({ connect }: { connect: () => void }) {
  const [tab, setTab] = useState("Contas");
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">INSTITUIÇÕES</span>
          <h1>Contas conectadas.</h1>
          <p>Visibilidade sem abrir mão do controle e da privacidade.</p>
        </div>
        <button className="primary" onClick={connect}>
          <Icon name="plus" size={18} /> Conectar instituição
        </button>
      </header>
      <div className="segmented">
        <button className={tab === "Contas" ? "active" : ""} onClick={() => setTab("Contas")}>
          Contas
        </button>
        <button className={tab === "Conexões" ? "active" : ""} onClick={() => setTab("Conexões")}>
          Conexões e acesso
        </button>
      </div>
      {tab === "Contas" ? (
        <div className="accounts-grid">
          <section className="institution panel">
            <div className="institution-head">
              <span className="bank-logo itau">i</span>
              <span>
                <b>Itaú</b>
                <small>
                  <i className="online" /> Atualizado hoje, 10:14
                </small>
              </span>
              <button>
                <Icon name="more" />
              </button>
            </div>
            <div className="account-card">
              <span>CONTA CORRENTE •• 2147</span>
              <b>R$ 8.420,16</b>
              <small>Saldo disponível informado pela instituição</small>
            </div>
            <div className="account-card muted">
              <span>POUPANÇA •• 9081</span>
              <b>R$ 3.284,25</b>
              <small>Saldo disponível</small>
            </div>
            <button className="institution-link">
              Ver 86 movimentações <Icon name="arrow" size={16} />
            </button>
          </section>
          <section className="institution panel">
            <div className="institution-head">
              <span className="bank-logo inter">in</span>
              <span>
                <b>Banco Inter</b>
                <small className="warn-text">
                  <i /> Atenção necessária
                </small>
              </span>
              <button>
                <Icon name="more" />
              </button>
            </div>
            <div className="connection-warning">
              <Icon name="lock" />
              <span>
                <b>Autorização expirada</b>
                <small>Os dados estão sem atualizar desde 12 jun.</small>
              </span>
              <button onClick={connect}>Reconectar</button>
            </div>
            <div className="account-card">
              <span>CONTA DIGITAL •• 6620</span>
              <b>R$ 3.726,41</b>
              <small>Último saldo conhecido · 12 jun</small>
            </div>
            <button className="institution-link">
              Ver detalhes <Icon name="arrow" size={16} />
            </button>
          </section>
          <section className="institution panel">
            <div className="institution-head">
              <span className="bank-logo nu">nu</span>
              <span>
                <b>Nubank</b>
                <small>
                  <i className="syncing" /> Sincronizando agora
                </small>
              </span>
              <button>
                <Icon name="more" />
              </button>
            </div>
            <div className="account-card">
              <span>CONTA •• 7731</span>
              <b>R$ 0,00</b>
              <small>Saldo disponível · atualizado 10:12</small>
            </div>
            <div className="sync-progress">
              <i />
              <span>Importando novas movimentações…</span>
            </div>
            <button className="institution-link">
              Acompanhar sincronização <Icon name="arrow" size={16} />
            </button>
          </section>
        </div>
      ) : (
        <Connections connect={connect} />
      )}
      <div className="trust-note">
        <Icon name="shield" />
        <div>
          <b>Suas senhas bancárias nunca passam por aqui.</b>
          <p>
            Este protótipo simula conexões usando dados fictícios. Em um produto real, o acesso
            seria autorizado pela própria instituição e poderia ser revogado a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}

function Connections({ connect }: { connect: () => void }) {
  return (
    <section className="panel connections-table">
      <div className="connection-row">
        <span className="bank-logo itau">i</span>
        <span>
          <b>Itaú</b>
          <small>2 contas · 1 cartão</small>
        </span>
        <span className="connection-state ok">Conectado</span>
        <span>
          <b>Hoje, 10:14</b>
          <small>Próxima atualização automática</small>
        </span>
        <button>Gerenciar</button>
      </div>
      <div className="connection-row">
        <span className="bank-logo inter">in</span>
        <span>
          <b>Banco Inter</b>
          <small>1 conta</small>
        </span>
        <span className="connection-state error">Ação necessária</span>
        <span>
          <b>12 jun, 18:42</b>
          <small>Autorização expirada</small>
        </span>
        <button onClick={connect}>Reconectar</button>
      </div>
      <div className="connection-row">
        <span className="bank-logo nu">nu</span>
        <span>
          <b>Nubank</b>
          <small>1 conta · 1 cartão</small>
        </span>
        <span className="connection-state sync">Sincronizando</span>
        <span>
          <b>Agora</b>
          <small>Processando 12 itens</small>
        </span>
        <button>Detalhes</button>
      </div>
    </section>
  );
}

function Cards() {
  const [card, setCard] = useState("Nubank");
  const [cycle, setCycle] = useState("Atual");
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">CARTÕES</span>
          <h1>Compras e ciclos.</h1>
          <p>Uma leitura clara do que já aconteceu e do que vem depois.</p>
        </div>
        <button className="secondary">
          <Icon name="plus" /> Adicionar cartão manual
        </button>
      </header>
      <div className="card-tabs">
        <button className={card === "Nubank" ? "active" : ""} onClick={() => setCard("Nubank")}>
          <span className="bank-logo nu">nu</span>
          <span>
            Nubank Platinum<small>•• 4582</small>
          </span>
        </button>
        <button className={card === "Itaú" ? "active" : ""} onClick={() => setCard("Itaú")}>
          <span className="bank-logo itau">i</span>
          <span>
            Itaú Click<small>•• 9012</small>
          </span>
        </button>
      </div>
      <section className="credit-hero">
        <div className={`credit-card-art ${card === "Itaú" ? "orange" : ""}`}>
          <div className="card-shine" />
          <span>{card}</span>
          <div className="chip" />
          <small>PLATINUM</small>
          <b>•••• &nbsp;•••• &nbsp;•••• &nbsp;{card === "Nubank" ? "4582" : "9012"}</b>
          <p>MARINA ALVES</p>
        </div>
        <div className="invoice-summary">
          <span className="overline">CICLO ATUAL · ESTIMATIVA</span>
          <h2>{card === "Nubank" ? "R$ 2.864,90" : "R$ 1.284,12"}</h2>
          <p>
            Fecha em <b>6 dias</b> · vencimento 24 jun
          </p>
          <div className="limit-bar">
            <i style={{ width: card === "Nubank" ? "43%" : "28%" }} />
          </div>
          <div>
            <span>
              Limite usado <b>{card === "Nubank" ? "43%" : "28%"}</b>
            </span>
            <span>
              Disponível <b>{card === "Nubank" ? "R$ 3.835,10" : "R$ 3.315,88"}</b>
            </span>
          </div>
          <button className="light-button">
            Ver detalhes do limite <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="cycle-note">
          <Icon name="info" />
          <p>
            <b>Estimativa com base nas compras importadas.</b>
            <br />O valor pode diferir da fatura oficial da instituição.
          </p>
        </div>
      </section>
      <div className="cycle-picker">
        <span>CICLOS</span>
        {["Maio · encerrado", "Atual", "Julho · previsto"].map((x) => (
          <button key={x} className={cycle === x ? "active" : ""} onClick={() => setCycle(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="cards-content-grid">
        <section className="panel invoice-breakdown">
          <SectionTitle
            eyebrow={cycle.toUpperCase()}
            title={cycle === "Atual" ? "Como a estimativa se forma" : "Resumo do ciclo"}
          />
          <div className="breakdown-chart">
            <div className="bars">
              {[46, 68, 32, 78, 61, 90, 54, 73, 42, 66, 87, 58].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} className={i > 8 ? "projected" : ""} />
              ))}
            </div>
            <div className="bar-labels">
              <span>1 jun</span>
              <span>Hoje</span>
              <span>Fechamento</span>
            </div>
          </div>
          <div className="breakdown-lines">
            <p>
              <span>Compras confirmadas</span>
              <b>R$ 2.612,43</b>
            </p>
            <p>
              <span>Compras pendentes</span>
              <b>R$ 252,47</b>
            </p>
            <p>
              <span>Pagamentos da fatura</span>
              <b className="green">− R$ 0,00</b>
            </p>
            <p className="total">
              <span>Estimativa do ciclo</span>
              <b>R$ 2.864,90</b>
            </p>
          </div>
        </section>
        <section className="panel installments">
          <SectionTitle eyebrow="PARCELAMENTOS" title="Próximas parcelas" action="Ver todos" />
          {[
            ["iPhone 15 · 6 de 12", "R$ 416,58", "R$ 2.499,48 restantes"],
            ["Passagem LATAM · 3 de 6", "R$ 284,32", "R$ 852,96 restantes"],
            ["Tok&Stok · 2 de 4", "R$ 198,75", "R$ 397,50 restantes"],
          ].map((x, i) => (
            <div className="installment-row" key={x[0]}>
              <span>{i + 1}</span>
              <div>
                <b>{x[0]}</b>
                <small>{x[2]}</small>
                <i>
                  <em style={{ width: `${[50, 50, 50][i]}%` }} />
                </i>
              </div>
              <strong>{x[1]}</strong>
            </div>
          ))}
          <div className="future-total">
            <span>Comprometido nos próximos ciclos</span>
            <b>R$ 3.749,94</b>
          </div>
        </section>
      </div>
    </div>
  );
}

function Review({ notify }: { notify: (x: string, undo?: boolean) => void }) {
  const [selected, setSelected] = useState(0);
  const [items, setItems] = useState([
    "Possível duplicidade",
    "Categoria incerta",
    "Valor divergente",
  ]);
  const resolve = (msg: string) => {
    setItems((v) => v.filter((_, i) => i !== selected));
    setSelected(0);
    notify(msg, true);
  };
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">CENTRAL DE REVISÃO</span>
          <h1>Decisões com contexto.</h1>
          <p>Nada é alterado sem sua confirmação.</p>
        </div>
        <div className="review-progress">
          <span>
            <b>{items.length}</b> pendentes
          </span>
          <i>
            <em style={{ width: `${((6 - items.length) / 6) * 100}%` }} />
          </i>
          <small>3 de 6 revisados</small>
        </div>
      </header>
      {items.length ? (
        <div className="review-layout">
          <aside className="review-queue panel">
            <div className="queue-head">
              <span>FILA DE ATENÇÃO</span>
              <button>
                <Icon name="filter" size={17} />
              </button>
            </div>
            {items.map((x, i) => (
              <button
                key={x}
                className={selected === i ? "active" : ""}
                onClick={() => setSelected(i)}
              >
                <span className={`priority p${i}`} />
                <div>
                  <b>{x}</b>
                  <small>
                    {i === 0
                      ? "Netflix · R$ 55,90"
                      : i === 1
                        ? "MERCADOPAGO · R$ 82,40"
                        : "Farmácia · diferença de R$ 4,00"}
                  </small>
                  <em>
                    {i === 0 ? "ALTA CONFIANÇA" : i === 1 ? "PRECISA DE CATEGORIA" : "IMPORTANTE"}
                  </em>
                </div>
                <Icon name="arrow" size={16} />
              </button>
            ))}
            <div className="queue-footer">
              <Icon name="check" />
              <span>
                <b>3 itens resolvidos</b>
                <small>Veja ou desfaça no histórico</small>
              </span>
            </div>
          </aside>
          <main className="review-detail panel">
            <div className="review-title">
              <div>
                <span className="badge">POSSÍVEL DUPLICIDADE</span>
                <h2>Estas duas movimentações são a mesma?</h2>
                <p>Encontramos valores e datas muito próximos. Compare antes de decidir.</p>
              </div>
              <span className="confidence">
                <b>92%</b>
                <small>confiança da sugestão</small>
              </span>
            </div>
            <div className="compare-labels">
              <span>REGISTRO IMPORTADO</span>
              <span>REGISTRO MANUAL</span>
            </div>
            <div className="compare-cards">
              <article>
                <div className="source">
                  <span className="bank-logo nu">nu</span>
                  <span>
                    <b>Nubank</b>
                    <small>Importado hoje, 10:12</small>
                  </span>
                </div>
                <h3>Netflix.com</h3>
                <strong>R$ 55,90</strong>
                <dl>
                  <div>
                    <dt>Data da compra</dt>
                    <dd>9 jun 2025</dd>
                  </div>
                  <div>
                    <dt>Forma de pagamento</dt>
                    <dd>Crédito •• 4582</dd>
                  </div>
                  <div>
                    <dt>Categoria</dt>
                    <dd>Assinaturas</dd>
                  </div>
                </dl>
              </article>
              <div className="match-line">
                <span>
                  <Icon name="check" />
                </span>
              </div>
              <article>
                <div className="source">
                  <span className="manual-source">
                    <Icon name="edit" />
                  </span>
                  <span>
                    <b>Adicionado por você</b>
                    <small>Em 9 jun, 20:14</small>
                  </span>
                </div>
                <h3>Netflix</h3>
                <strong>R$ 55,90</strong>
                <dl>
                  <div>
                    <dt>Data da compra</dt>
                    <dd>9 jun 2025</dd>
                  </div>
                  <div className="difference">
                    <dt>Forma de pagamento</dt>
                    <dd>Não informada</dd>
                  </div>
                  <div>
                    <dt>Categoria</dt>
                    <dd>Assinaturas</dd>
                  </div>
                </dl>
              </article>
            </div>
            <div className="decision-explain">
              <Icon name="info" />
              <p>
                <b>Se você confirmar</b>, os registros serão vinculados e contarão como uma única
                despesa. O registro importado será a fonte principal e suas anotações manuais serão
                preservadas.
              </p>
            </div>
            <div className="review-actions">
              <button
                className="ghost-danger"
                onClick={() => resolve("Sugestão rejeitada. Os registros continuam separados.")}
              >
                Não são a mesma
              </button>
              <button
                className="secondary"
                onClick={() => resolve("Mantidos como registros independentes.")}
              >
                Manter separados
              </button>
              <button
                className="primary"
                onClick={() => resolve("Movimentações vinculadas com sucesso.")}
              >
                Sim, vincular registros
              </button>
            </div>
          </main>
        </div>
      ) : (
        <section className="panel all-done">
          <span>
            <Icon name="check" size={34} />
          </span>
          <h2>Está tudo em ordem.</h2>
          <p>
            Você revisou todos os itens. Novas sugestões aparecerão aqui, sempre aguardando sua
            decisão.
          </p>
          <button
            className="secondary"
            onClick={() =>
              setItems(["Possível duplicidade", "Categoria incerta", "Valor divergente"])
            }
          >
            Rever demonstração
          </button>
        </section>
      )}
    </div>
  );
}

function Planning({ notify }: { notify: (x: string) => void }) {
  const [budget, setBudget] = useState(10500);
  const [editing, setEditing] = useState(false);
  const [goal, setGoal] = useState(8600);
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">PLANEJAMENTO</span>
          <h1>Um plano que cabe na vida.</h1>
          <p>Limites simples, metas possíveis e projeções transparentes.</p>
        </div>
        <button className="primary" onClick={() => setEditing(true)}>
          <Icon name="plus" /> Novo plano
        </button>
      </header>
      <div className="forecast-banner">
        <Icon name="sparkles" />
        <div>
          <b>Projeção para o fim de junho</b>
          <p>
            Se mantiver o ritmo atual, você deve encerrar o mês com <strong>R$ 3.180 livres</strong>{" "}
            após despesas planejadas.
          </p>
        </div>
        <span>PROJEÇÃO</span>
      </div>
      <div className="planning-grid">
        <section className="panel budget-main">
          <SectionTitle
            eyebrow="ORÇAMENTO MENSAL"
            title="Junho em perspectiva"
            action="Ajustar"
            onAction={() => setEditing(true)}
          />
          <div className="budget-hero">
            <div className="large-ring">
              <div>
                <b>76%</b>
                <span>utilizado</span>
              </div>
            </div>
            <div>
              <span>GASTO CONFIRMADO</span>
              <h2>R$ 7.958,80</h2>
              <p>de {money(budget)} planejados</p>
              <small>
                <i /> Dentro do ritmo esperado
              </small>
            </div>
          </div>
          <div className="budget-categories">
            {[
              ["Moradia", 2840, 3000, "#caff80"],
              ["Alimentação", 1396, 1800, "#8872ff"],
              ["Transporte", 988, 900, "#ff9b6c"],
              ["Lazer", 686, 1200, "#63d8c0"],
            ].map((x) => (
              <button key={x[0] as string}>
                <span>
                  <i style={{ background: x[3] as string }} />
                  {x[0]}
                </span>
                <span className="budget-track">
                  <i
                    style={{
                      width: `${Math.min(100, ((x[1] as number) / (x[2] as number)) * 100)}%`,
                      background: x[3] as string,
                    }}
                  />
                </span>
                <span>
                  <b>{money(x[1] as number)}</b>
                  <small>de {money(x[2] as number)}</small>
                </span>
                {(x[1] as number) > (x[2] as number) && <em>ACIMA</em>}
              </button>
            ))}
          </div>
        </section>
        <section className="panel savings-goal">
          <SectionTitle eyebrow="META DE ECONOMIA" title="Patagônia 2026" action="Editar" />
          <div className="goal-visual">
            <span>✦</span>
            <div>
              <b>{money(goal)}</b>
              <small>de R$ 12.000,00</small>
            </div>
          </div>
          <div className="goal-track">
            <i style={{ width: `${goal / 120}%` }} />
          </div>
          <div className="goal-stats">
            <div>
              <span>FALTAM</span>
              <b>{money(12000 - goal)}</b>
            </div>
            <div>
              <span>PREVISÃO</span>
              <b>Dez 2025</b>
            </div>
          </div>
          <button
            className="primary wide"
            onClick={() => {
              setGoal((g) => g + 400);
              notify("R$ 400,00 adicionados à meta Patagônia.");
            }}
          >
            Adicionar à meta
          </button>
          <small className="projection-label">Previsão baseada em aportes de R$ 570/mês</small>
        </section>
        <section className="panel recurring">
          <SectionTitle eyebrow="PRÓXIMOS 30 DIAS" title="Entradas e compromissos" />
          <div className="recurring-line">
            <span className="tx-icon income">
              <Icon name="briefcase" />
            </span>
            <span>
              <b>Salário Nuvem Labs</b>
              <small>Esperado em 3 jul</small>
            </span>
            <strong className="green">+ R$ 12.850</strong>
            <em>ESPERADO</em>
          </div>
          <div className="recurring-line">
            <span className="tx-icon">
              <Icon name="home" />
            </span>
            <span>
              <b>Aluguel</b>
              <small>Previsto para 5 jul</small>
            </span>
            <strong>− R$ 2.840</strong>
            <em>PREVISTO</em>
          </div>
          <div className="actual-warning">
            <Icon name="info" />
            <span>
              Valores esperados são projeções e não entram no saldo até serem confirmados.
            </span>
          </div>
        </section>
      </div>
      {editing && (
        <Modal title="Ajustar orçamento mensal" close={() => setEditing(false)}>
          <div className="form-stack">
            <label>
              Limite total para junho
              <div className="currency-input">
                <span>R$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>
            </label>
            <p className="form-hint">
              <Icon name="info" size={16} /> Seu gasto confirmado atual é de R$ 7.958,80.
            </p>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <button
                className="primary"
                onClick={() => {
                  setEditing(false);
                  notify("Orçamento atualizado com sucesso.");
                }}
              >
                Salvar limite
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Reports() {
  const [metric, setMetric] = useState("Saídas");
  const [hover, setHover] = useState(5);
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">RELATÓRIOS</span>
          <h1>Padrões que viram escolhas.</h1>
          <p>Explore seus dados confirmados e entenda o que mudou.</p>
        </div>
        <button className="secondary">
          <Icon name="download" /> Exportar relatório
        </button>
      </header>
      <div className="report-controls">
        <div className="segmented inline">
          {["Saídas", "Entradas", "Resultado"].map((x) => (
            <button key={x} className={metric === x ? "active" : ""} onClick={() => setMetric(x)}>
              {x}
            </button>
          ))}
        </div>
        <button className="date-button">
          <Icon name="calendar" /> Últimos 6 meses <Icon name="down" size={14} />
        </button>
        <button className="date-button">
          Todas as instituições <Icon name="down" size={14} />
        </button>
      </div>
      <div className="report-kpis">
        <div>
          <span>MÉDIA MENSAL</span>
          <b>R$ 8.412,30</b>
          <small>
            <i className="good" /> 4,8% menor que antes
          </small>
        </div>
        <div>
          <span>MAIOR CATEGORIA</span>
          <b>Moradia</b>
          <small>34% das despesas</small>
        </div>
        <div>
          <span>VARIAÇÃO NO PERÍODO</span>
          <b>− R$ 486,20</b>
          <small>
            <i className="good" /> tendência de queda
          </small>
        </div>
        <div>
          <span>COBERTURA DOS DADOS</span>
          <b>96%</b>
          <small>2 fontes atualizadas hoje</small>
        </div>
      </div>
      <section className="panel evolution">
        <SectionTitle eyebrow={`${metric.toUpperCase()} CONFIRMADAS`} title="Evolução mensal" />
        <div className="legend">
          <span>
            <i className="solid" />
            2025
          </span>
          <span>
            <i className="dashed" />
            2024
          </span>
        </div>
        <div className="large-chart">
          <div className="y-axis">
            <span>R$ 12 mil</span>
            <span>R$ 8 mil</span>
            <span>R$ 4 mil</span>
            <span>R$ 0</span>
          </div>
          <div className="plot">
            {[1, 2, 3].map((i) => (
              <i className={`line l${i}`} key={i} />
            ))}
            <svg viewBox="0 0 700 240" preserveAspectRatio="none">
              <path
                d="M0 74 C80 58 105 111 175 96 S265 129 350 114 S430 52 525 83 S610 102 700 72"
                fill="none"
                stroke="#d0c9bd"
                strokeWidth="2"
                strokeDasharray="7 7"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0 132 C70 142 110 104 175 116 S265 91 350 103 S440 121 525 88 S625 69 700 78"
                fill="none"
                stroke="#191c19"
                strokeWidth="3.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {[0, 1, 2, 3, 4, 5].map((x) => (
              <button
                onMouseEnter={() => setHover(x)}
                onFocus={() => setHover(x)}
                key={x}
                className={`report-hit r${x}`}
              />
            ))}
            <div className="report-tooltip" style={{ left: `${7 + hover * 17}%` }}>
              <small>{["JAN", "FEV", "MAR", "ABR", "MAI", "JUN"][hover]} 2025</small>
              <b>{money([9320, 8840, 9120, 8560, 8445, 7958][hover])}</b>
              <span>↓ {hover + 2},4% no mês</span>
            </div>
            <div className="months">
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="reports-bottom">
        <section className="panel category-report">
          <SectionTitle eyebrow="DISTRIBUIÇÃO" title="Categorias em junho" />
          <div className="horizontal-bars">
            {[
              ["Moradia", 2840, 100],
              ["Alimentação", 1396, 49],
              ["Transporte", 988, 35],
              ["Saúde", 768, 27],
              ["Lazer", 686, 24],
            ].map((x, i) => (
              <button key={x[0] as string}>
                <span>{x[0]}</span>
                <i>
                  <em
                    style={{
                      width: `${x[2]}%`,
                      background: ["#caff80", "#8872ff", "#ff9b6c", "#63d8c0", "#e7d65c"][i],
                    }}
                  />
                </i>
                <b>{money(x[1] as number)}</b>
              </button>
            ))}
          </div>
        </section>
        <section className="panel insight-card">
          <span className="insight-icon">
            <Icon name="sparkles" />
          </span>
          <span className="overline">INSIGHT DO PERÍODO</span>
          <h2>Você gastou menos com refeições fora.</h2>
          <p>
            Foram <b>R$ 312,40 a menos</b> que em maio. A maior mudança veio de restaurantes nos
            fins de semana.
          </p>
          <button>
            Ver movimentações relacionadas <Icon name="arrow" size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}

function Automations({ notify }: { notify: (x: string) => void }) {
  const [create, setCreate] = useState(false);
  const [rules, setRules] = useState([
    {
      name: "Uber → Transporte por aplicativo",
      desc: "Descrição contém “UBER”",
      count: 18,
      on: true,
    },
    { name: "Zaffari → Mercado", desc: "Descrição contém “ZAFFARI”", count: 7, on: true },
    { name: "Netflix → Assinaturas", desc: "Nome normalizado é “Netflix”", count: 6, on: false },
  ]);
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">AUTOMAÇÕES</span>
          <h1>Menos trabalho repetitivo.</h1>
          <p>Regras transparentes que você pode revisar e desfazer.</p>
        </div>
        <button className="primary" onClick={() => setCreate(true)}>
          <Icon name="plus" /> Nova regra
        </button>
      </header>
      <div className="automation-stats">
        <div>
          <span>
            <Icon name="wand" />
          </span>
          <p>
            <b>31 movimentações</b> organizadas automaticamente este mês
          </p>
        </div>
        <small>Alterações manuais sempre têm prioridade sobre regras.</small>
      </div>
      <section className="panel rules">
        <div className="rules-head">
          <span>REGRA</span>
          <span>EFEITO</span>
          <span>ÚLTIMOS 30 DIAS</span>
          <span>STATUS</span>
          <span />
        </div>
        {rules.map((r, i) => (
          <div className="rule-row" key={r.name}>
            <span className="rule-symbol">
              <Icon name={i === 0 ? "car" : i === 1 ? "bag" : "play"} />
            </span>
            <span>
              <b>{r.name}</b>
              <small>{r.desc}</small>
            </span>
            <span>
              <b>Categorizar automaticamente</b>
              <small>Respeita edições manuais</small>
            </span>
            <span>
              <b>{r.count}</b>
              <small>movimentações</small>
            </span>
            <button
              aria-label={`${r.on ? "Desativar" : "Ativar"} regra`}
              className={`switch ${r.on ? "on" : ""}`}
              onClick={() =>
                setRules((rs) => rs.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))
              }
            >
              <i />
            </button>
            <button>
              <Icon name="more" />
            </button>
          </div>
        ))}
      </section>
      <div className="conflict-card">
        <Icon name="info" />
        <div>
          <b>1 conflito potencial encontrado</b>
          <p>
            A regra “Mercado Pago” também pode afetar uma movimentação já coberta por outra regra.
          </p>
        </div>
        <button>Revisar conflito</button>
      </div>
      {create && (
        <Modal title="Criar regra inteligente" close={() => setCreate(false)}>
          <div className="rule-builder">
            <div className="builder-step">
              <span>1</span>
              <div>
                <b>Quando uma movimentação…</b>
                <div className="condition-line">
                  <select>
                    <option>Descrição contém</option>
                    <option>Nome é exatamente</option>
                    <option>Valor é maior que</option>
                  </select>
                  <input defaultValue="PADARIA REAL" />
                </div>
              </div>
            </div>
            <div className="builder-step">
              <span>2</span>
              <div>
                <b>Então…</b>
                <div className="condition-line">
                  <select>
                    <option>Categorizar como</option>
                    <option>Renomear para</option>
                  </select>
                  <select>
                    <option>Alimentação › Padarias</option>
                    <option>Mercado</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="rule-preview">
              <span>PRÉVIA · 4 MOVIMENTAÇÕES</span>
              <p>
                <b>Padaria Real · R$ 18,40</b>
                <em>→ Alimentação › Padarias</em>
              </p>
              <p>
                <b>PADARIA REAL 023 · R$ 32,10</b>
                <em>→ Alimentação › Padarias</em>
              </p>
              <small>A regra não altera 1 movimentação editada manualmente.</small>
            </div>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setCreate(false)}>
                Cancelar
              </button>
              <button
                className="primary"
                onClick={() => {
                  setRules((r) => [
                    ...r,
                    {
                      name: "Padaria Real → Padarias",
                      desc: "Descrição contém “PADARIA REAL”",
                      count: 4,
                      on: true,
                    },
                  ]);
                  setCreate(false);
                  notify("Regra criada e aplicada a 4 movimentações.");
                }}
              >
                Criar e aplicar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Settings({ notify }: { notify: (x: string) => void }) {
  const [theme, setTheme] = useState("Claro");
  const [privacy, setPrivacy] = useState(true);
  return (
    <div className="page">
      <header className="page-intro compact">
        <div>
          <span className="eyebrow">PREFERÊNCIAS</span>
          <h1>Seu espaço, suas regras.</h1>
          <p>Ajuste acesso, privacidade e a forma como o Finance Tracker funciona.</p>
        </div>
      </header>
      <div className="settings-layout">
        <aside className="settings-nav">
          {[
            "Perfil e preferências",
            "Aparência e acessibilidade",
            "Segurança e sessões",
            "Privacidade e dados",
            "Conexões",
            "Instalar aplicativo",
          ].map((x, i) => (
            <button className={i === 0 ? "active" : ""} key={x}>
              {x}
              <Icon name="arrow" size={15} />
            </button>
          ))}
        </aside>
        <main className="settings-main">
          <section className="panel settings-section">
            <div className="profile-row">
              <div className="avatar large">MA</div>
              <div>
                <h2>Marina Alves</h2>
                <p>marina.alves@exemplo.com</p>
              </div>
              <button className="secondary">Editar perfil</button>
            </div>
            <div className="setting-row">
              <div>
                <b>Moeda e região</b>
                <small>Português (Brasil) · Real brasileiro</small>
              </div>
              <button>
                Alterar <Icon name="arrow" size={15} />
              </button>
            </div>
            <div className="setting-row">
              <div>
                <b>Início do mês financeiro</b>
                <small>Dia 1 de cada mês</small>
              </div>
              <button>
                Alterar <Icon name="arrow" size={15} />
              </button>
            </div>
          </section>
          <section className="panel settings-section">
            <SectionTitle eyebrow="APARÊNCIA" title="Conforto visual" />
            <div className="theme-options">
              {["Claro", "Sistema", "Escuro"].map((x) => (
                <button key={x} className={theme === x ? "active" : ""} onClick={() => setTheme(x)}>
                  <i className={x.toLowerCase()} />
                  <b>{x}</b>
                  <small>
                    {x === "Sistema"
                      ? "Acompanha o dispositivo"
                      : x === "Claro"
                        ? "Sempre claro"
                        : "Sempre escuro"}
                  </small>
                </button>
              ))}
            </div>
            <div className="setting-row">
              <div>
                <b>Reduzir movimento</b>
                <small>Minimiza transições e animações decorativas</small>
              </div>
              <button
                className={`switch ${privacy ? "on" : ""}`}
                onClick={() => setPrivacy(!privacy)}
              >
                <i />
              </button>
            </div>
          </section>
          <section className="panel settings-section">
            <SectionTitle eyebrow="SEGURANÇA" title="Acesso e sessões" />
            <div className="security-card">
              <span>
                <Icon name="lock" />
              </span>
              <div>
                <b>Passkey ativa neste dispositivo</b>
                <small>Último acesso hoje, 09:36 · Safari no macOS</small>
              </div>
              <span className="connection-state ok">Protegido</span>
            </div>
            <button className="setting-action">
              <Icon name="shield" /> Gerenciar passkeys e sessões <Icon name="arrow" size={16} />
            </button>
          </section>
          <section className="panel settings-section">
            <SectionTitle eyebrow="PRIVACIDADE E DADOS" title="Você controla seus dados" />
            <button
              className="setting-action"
              onClick={() => notify("Seu arquivo de exportação está sendo preparado.")}
            >
              <Icon name="download" /> Exportar meus dados <Icon name="arrow" size={16} />
            </button>
            <button className="setting-action danger">
              <Icon name="trash" /> Excluir todos os dados <Icon name="arrow" size={16} />
            </button>
            <p className="privacy-copy">
              Esta é uma demonstração: nenhum dado financeiro real é armazenado ou compartilhado.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button onClick={close} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function TransactionModal({
  item,
  close,
  save,
}: {
  item?: Transaction;
  close: () => void;
  save: (x: Transaction) => void;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [value, setValue] = useState(item ? Math.abs(item.value).toFixed(2).replace(".", ",") : "");
  const [category, setCategory] = useState(item?.category || "Alimentação");
  const [editing, setEditing] = useState(!item);
  if (item && !editing)
    return (
      <Modal title="Detalhes da movimentação" close={close}>
        <div className="tx-detail">
          <div className="detail-amount">
            <span className="tx-icon">
              <Icon name={item.icon} />
            </span>
            <span>
              <small>{item.title}</small>
              <b>{money(item.value)}</b>
              <Status type={item.status} />
            </span>
          </div>
          <div className="detail-grid">
            <div>
              <span>Data</span>
              <b>{item.date}</b>
            </div>
            <div>
              <span>Categoria</span>
              <b>{item.category}</b>
            </div>
            <div>
              <span>Conta ou cartão</span>
              <b>{item.account}</b>
            </div>
            <div>
              <span>Tipo</span>
              <b>
                {item.kind === "transferencia"
                  ? "Transferência própria"
                  : item.value > 0
                    ? "Receita"
                    : "Despesa"}
              </b>
            </div>
          </div>
          <div className="provenance">
            <Icon name="shield" />
            <div>
              <b>Origem verificada</b>
              <p>Importada da instituição · última sincronização hoje, 10:14.</p>
            </div>
          </div>
          <div className="history-line">
            <span />
            <div>
              <b>Hoje, 10:12</b>
              <p>Movimentação importada e categorizada automaticamente.</p>
            </div>
          </div>
          <div className="modal-actions">
            <button className="secondary" onClick={close}>
              Fechar
            </button>
            <button className="primary" onClick={() => setEditing(true)}>
              <Icon name="edit" size={16} /> Editar
            </button>
          </div>
        </div>
      </Modal>
    );
  return (
    <Modal title={item ? "Editar movimentação" : "Nova movimentação"} close={close}>
      <div className="form-stack">
        <div className="type-pills">
          <Pill active>Despesa</Pill>
          <Pill>Receita</Pill>
          <Pill>Transferência</Pill>
        </div>
        <label>
          Valor
          <div className="currency-input prominent">
            <span>R$</span>
            <input
              autoFocus
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^\d,]/g, ""))}
            />
          </div>
        </label>
        <label>
          Descrição
          <input
            placeholder="Ex.: almoço no Nomo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <div className="form-grid">
          <label>
            Data
            <input type="date" defaultValue="2025-06-15" />
          </label>
          <label>
            Categoria
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Alimentação</option>
              <option>Mercado</option>
              <option>Transporte</option>
              <option>Saúde</option>
              <option>Lazer</option>
              <option>Assinaturas</option>
            </select>
          </label>
        </div>
        <label>
          Pago com
          <select>
            <option>Itaú Click •• 9012</option>
            <option>Nubank Platinum •• 4582</option>
            <option>Conta Inter •• 6620</option>
            <option>Não informado</option>
          </select>
        </label>
        <details>
          <summary>
            Mais opções <Icon name="down" size={15} />
          </summary>
          <div className="form-grid">
            <label>
              Parcelas
              <select>
                <option>À vista</option>
                <option>2 parcelas</option>
                <option>3 parcelas</option>
              </select>
            </label>
            <label>
              Observação
              <input placeholder="Opcional" />
            </label>
          </div>
        </details>
        <div className="modal-actions">
          <button className="secondary" onClick={close}>
            Cancelar
          </button>
          <button
            className="primary"
            disabled={!title || !value}
            onClick={() =>
              save({
                ...item,
                id: item?.id || Date.now(),
                title,
                detail: "Crédito · Itaú •• 9012",
                value: -Number(value.replace(".", "").replace(",", ".")),
                date: "Hoje, agora",
                category,
                account: "Itaú",
                status: "confirmada",
                icon: "bag",
                kind: "despesa",
              })
            }
          >
            {item ? "Salvar alterações" : "Adicionar despesa"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ConnectModal({ close, notify }: { close: () => void; notify: (x: string) => void }) {
  const [step, setStep] = useState(1);
  const [bank, setBank] = useState("Inter");
  return (
    <Modal
      title={
        step === 1
          ? "Conectar uma instituição"
          : step === 2
            ? "Autorizar conexão"
            : "Conexão concluída"
      }
      close={close}
    >
      {step === 1 && (
        <div className="connect-flow">
          <p>
            Escolha uma instituição para simular a conexão. Nenhuma credencial real será solicitada.
          </p>
          <div className="bank-options">
            {[
              ["Itaú", "itau", "i"],
              ["Nubank", "nu", "nu"],
              ["Inter", "inter", "in"],
              ["Santander", "santander", "s"],
            ].map((x) => (
              <button
                key={x[0]}
                className={bank === x[0] ? "active" : ""}
                onClick={() => setBank(x[0])}
              >
                <span className={`bank-logo ${x[1]}`}>{x[2]}</span>
                <b>{x[0]}</b>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
          <div className="demo-indicator">
            <Icon name="shield" />
            <span>Ambiente demonstrativo · dados fictícios</span>
          </div>
          <div className="modal-actions">
            <button className="secondary" onClick={close}>
              Cancelar
            </button>
            <button className="primary" onClick={() => setStep(2)}>
              Continuar
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="authorize">
          <span className={`bank-logo ${bank.toLowerCase()}`}>
            {bank.slice(0, 2).toLowerCase()}
          </span>
          <h3>Você está conectando {bank}</h3>
          <p>
            O Finance Tracker poderá consultar saldos, contas, cartões e movimentações. Em um
            produto real, a autorização aconteceria no ambiente seguro da instituição.
          </p>
          <ul>
            <li>
              <Icon name="check" /> Acesso somente para leitura
            </li>
            <li>
              <Icon name="check" /> Você pode revogar quando quiser
            </li>
            <li>
              <Icon name="check" /> Válido por 90 dias
            </li>
          </ul>
          <button className="primary wide" onClick={() => setStep(3)}>
            Simular autorização
          </button>
          <button className="text-button center" onClick={() => setStep(1)}>
            Voltar
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="connect-success">
          <span>
            <Icon name="check" size={34} />
          </span>
          <h3>{bank} conectado</h3>
          <p>Encontramos 1 conta e 2 cartões. A primeira sincronização simulada começará agora.</p>
          <div className="found-items">
            <b>Conta corrente •• 4821</b>
            <small>Movimentações dos últimos 90 dias</small>
          </div>
          <button
            className="primary wide"
            onClick={() => {
              close();
              notify(`${bank} conectado. Sincronização iniciada.`);
            }}
          >
            Concluir
          </button>
        </div>
      )}
    </Modal>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("inicio");
  const [transactions, setTransactions] = useState(transactionsSeed);
  const [txModal, setTxModal] = useState<Transaction | null | undefined>(undefined);
  const [connect, setConnect] = useState(false);
  const [toast, setToast] = useState<{ text: string; undo?: boolean } | null>(null);
  const [more, setMore] = useState(false);
  const notify = (text: string, undo = false) => {
    setToast({ text, undo });
    window.setTimeout(() => setToast(null), 5000);
  };
  const navigate = (p: Page) => {
    setPage(p);
    setMore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pageTitle = useMemo(() => nav.find((n) => n.id === page)?.label || "Configurações", [page]);
  const saveTx = (x: Transaction) => {
    setTransactions((v) =>
      v.some((t) => t.id === x.id) ? v.map((t) => (t.id === x.id ? x : t)) : [x, ...v],
    );
    setTxModal(undefined);
    notify(x.id > 10 ? "Movimentação adicionada." : "Movimentação atualizada.");
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              className={page === n.id ? "active" : ""}
              onClick={() => navigate(n.id)}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.id === "revisar" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={page === "configuracoes" ? "active" : ""}
            onClick={() => navigate("configuracoes")}
          >
            <Icon name="settings" />
            <span>Configurações</span>
          </button>
          <div className="privacy-mini">
            <Icon name="shield" size={16} />
            <span>
              Dados protegidos
              <br />
              <b>Ambiente demonstrativo</b>
            </span>
          </div>
          <button className="profile-mini">
            <span className="avatar">MA</span>
            <span>
              <b>Marina Alves</b>
              <small>Conta pessoal</small>
            </span>
            <Icon name="more" size={18} />
          </button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="mobile-logo">
            <Logo />
          </div>
          <span className="breadcrumb">
            FINANCE TRACKER <i>/</i> {pageTitle.toUpperCase()}
          </span>
          <div>
            <button aria-label="Buscar" className="icon-button">
              <Icon name="search" />
            </button>
            <button aria-label="Notificações" className="icon-button notification">
              <Icon name="bell" />
              <i />
            </button>
            <button className="quick-add" onClick={() => setTxModal(null)}>
              <Icon name="plus" size={17} /> <span>Adicionar</span>
            </button>
          </div>
        </header>
        <main id="conteudo">
          {page === "inicio" && <Home go={navigate} openTx={(t) => setTxModal(t)} />}
          {page === "transacoes" && (
            <Transactions
              items={transactions}
              openTx={(t) => setTxModal(t)}
              add={() => setTxModal(null)}
            />
          )}
          {page === "contas" && <Accounts connect={() => setConnect(true)} />}
          {page === "cartoes" && <Cards />}
          {page === "revisar" && <Review notify={notify} />}
          {page === "planejamento" && <Planning notify={notify} />}
          {page === "relatorios" && <Reports />}
          {page === "automacoes" && <Automations notify={notify} />}
          {page === "configuracoes" && <Settings notify={notify} />}
        </main>
      </div>
      <nav className="mobile-nav">
        {nav.slice(0, 4).map((n) => (
          <button
            key={n.id}
            className={page === n.id ? "active" : ""}
            onClick={() => navigate(n.id)}
          >
            <Icon name={n.icon} />
            <span>{n.label === "Movimentações" ? "Movimentos" : n.label}</span>
          </button>
        ))}
        <button className={more ? "active" : ""} onClick={() => setMore(!more)}>
          <Icon name="more" />
          <span>Mais</span>
        </button>
      </nav>
      {more && (
        <div className="mobile-more">
          {nav.slice(4).map((n) => (
            <button key={n.id} onClick={() => navigate(n.id)}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.id === "revisar" && <em>3</em>}
            </button>
          ))}
          <button onClick={() => navigate("configuracoes")}>
            <Icon name="settings" />
            <span>Configurações</span>
          </button>
        </div>
      )}
      {txModal !== undefined && (
        <TransactionModal
          item={txModal || undefined}
          close={() => setTxModal(undefined)}
          save={saveTx}
        />
      )}
      {connect && <ConnectModal close={() => setConnect(false)} notify={notify} />}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" />
          </span>
          <p>{toast.text}</p>
          {toast.undo && (
            <button
              onClick={() => {
                setToast(null);
                notify("Ação desfeita.");
              }}
            >
              <Icon name="undo" size={16} /> Desfazer
            </button>
          )}
          <button aria-label="Fechar" onClick={() => setToast(null)}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
