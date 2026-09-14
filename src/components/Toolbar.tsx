import { useEffect, useRef, useState } from 'react';
import {
  Archive,
  CaretDown,
  ClipboardText,
  DownloadSimple,
  FileMd,
  ImageSquare,
  UploadSimple,
} from '@phosphor-icons/react';

import TonePicker from './TonePicker';

interface Props {
  viewMode: 'split' | 'preview';
  onViewMode: (m: 'split' | 'preview') => void;
  status: string | null;
  onCopy: () => void;
  /** 导入 .md / .zip 备份 */
  onImport: (files: File[]) => void;
  /** 导出当前草稿为 .md */
  onExportMarkdown: () => void;
  /** 导出全部草稿 + 图片为 zip 备份 */
  onExportBackup: () => void;
  /** 导出正文长图 PNG */
  onExportImage: () => void;
  /** 导出进行中：禁用菜单，避免重复触发 */
  exporting: boolean;
}

export default function Toolbar({
  viewMode,
  onViewMode,
  status,
  onCopy,
  onImport,
  onExportMarkdown,
  onExportBackup,
  onExportImage,
  exporting,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 点击菜单外 / Esc 关闭
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const runExport = (fn: () => void) => {
    setMenuOpen(false);
    fn();
  };

  return (
    <header className="toolbar">
      <div className="brand">
        {/* 印章式字标：平涂描边，不用发光徽标 */}
        <span className="brand-mark" aria-hidden="true">X</span>
        <span className="title">XIN-MD</span>
      </div>

      {/* 对照 / 预览 */}
      <div className="segmented" role="tablist" aria-label="工作区模式">
        {(['split', 'preview'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={viewMode === m}
            className={`seg-btn ${viewMode === m ? 'active' : ''}`}
            onClick={() => onViewMode(m)}
          >
            {m === 'split' ? '对照' : '预览'}
          </button>
        ))}
      </div>

      <div className="toolbar-right">
        {/* 编辑器色调（机械冷白 / 暖纸奶油 / 商务蓝 …），选择记在 localStorage */}
        <TonePicker />

        {/* 导入：.md 各建一篇草稿，.zip 按备份包整体还原 */}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".md,.markdown,.txt,.zip"
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onImport(files);
            e.target.value = ''; // 同一文件连选两次也要触发
          }}
        />
        <button className="btn" onClick={() => fileRef.current?.click()} title="导入 Markdown 文件或备份包">
          <UploadSimple size={15} weight="bold" />
          导入
        </button>

        <div className="menu-wrap" ref={menuRef}>
          <button
            className="btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            disabled={exporting}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <DownloadSimple size={15} weight="bold" />
            {exporting ? '导出中…' : '导出'}
            <CaretDown size={11} weight="bold" />
          </button>
          {menuOpen && (
            <div className="dropdown-menu" role="menu">
              <button role="menuitem" onClick={() => runExport(onExportMarkdown)}>
                <FileMd size={16} className="menu-icon" />
                当前草稿 .md
              </button>
              <button role="menuitem" onClick={() => runExport(onExportImage)}>
                <ImageSquare size={16} className="menu-icon" />
                正文长图 .png
              </button>
              <div className="dropdown-divider" />
              <button role="menuitem" onClick={() => runExport(onExportBackup)}>
                <Archive size={16} className="menu-icon" />
                全部备份 .zip
                <span className="menu-hint">草稿 + 图片</span>
              </button>
            </div>
          )}
        </div>

        <button className="btn primary" onClick={onCopy}>
          <ClipboardText size={15} weight="bold" />
          复制到公众号
        </button>

        {status && <span className="status show">{status}</span>}
      </div>
    </header>
  );
}
