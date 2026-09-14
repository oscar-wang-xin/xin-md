import { useEffect, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

/** 编辑器外壳色调。配色在 styles.css 的 html[data-shell-tone=…] 覆盖块中定义 */
export interface ShellTone {
  id: string;
  name: string;
  /** 色点（菜单与按钮上的小圆点） */
  dot: string;
}

export const SHELL_TONES: ShellTone[] = [
  { id: 'robot', name: '机械冷白', dot: '#5f6674' },
  { id: 'warm', name: '暖纸奶油', dot: '#d97757' },
  { id: 'business', name: '商务蓝', dot: '#2f6fb2' },
  { id: 'mint', name: '薄荷绿', dot: '#179c6b' },
  { id: 'ink', name: '墨水黑白', dot: '#262626' },
  { id: 'grape', name: '葡萄紫', dot: '#7c3aed' },
  { id: 'ali', name: '阿里橙', dot: '#ff6a00' },
  { id: 'china', name: '中国红', dot: '#c8102e' },
];

const STORAGE_KEY = 'xin-md-shell-tone';

function readStored(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && SHELL_TONES.some((t) => t.id === v) ? v : 'robot';
  } catch {
    return 'robot';
  }
}

export default function TonePicker() {
  const [tone, setTone] = useState<string>(readStored);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 应用到 <html> 的 data-shell-tone，CSS 据此切换变量组；并记住选择
  useEffect(() => {
    document.documentElement.dataset.shellTone = tone;
    try {
      localStorage.setItem(STORAGE_KEY, tone);
    } catch {
      /* 私密模式等场景忽略 */
    }
  }, [tone]);

  // 点击菜单外 / Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const current = SHELL_TONES.find((t) => t.id === tone) ?? SHELL_TONES[0];

  return (
    <div className="menu-wrap tone-picker" ref={ref}>
      <button
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        title="切换编辑器色调"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tone-dot" style={{ background: current.dot }} />
        <span>{current.name}</span>
        <CaretDown size={11} weight="bold" />
      </button>
      {open && (
        <div className="dropdown-menu tone-menu" role="menu">
          {SHELL_TONES.map((t) => (
            <button
              key={t.id}
              role="menuitem"
              className={t.id === tone ? 'active' : ''}
              onClick={() => {
                setTone(t.id);
                setOpen(false);
              }}
            >
              <span className="tone-dot" style={{ background: t.dot }} />
              <span className="tone-name">{t.name}</span>
              {t.id === tone && <span className="tone-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}