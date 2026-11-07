import { useEffect, useRef, type CSSProperties } from "react";
// The full package (not blockly/core) registers the built-in blocks and messages.
import * as Blockly from "blockly";

type Props = {
  options: Blockly.BlocklyOptions;
  theme: Blockly.Theme;
  /** Called once with the injected workspace (and again after a remount). */
  onInject?: (workspace: Blockly.WorkspaceSvg) => void;
  className?: string;
  style?: CSSProperties;
};

export function BlocklyWorkspace({
  options,
  theme,
  onInject,
  className,
  style,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  // Inject only on mount; later prop changes don't re-create the workspace.
  const initial = useRef({ options, theme, onInject });

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const { options, theme, onInject } = initial.current;
    const injected = Blockly.inject(element, { ...options, theme });
    workspace.current = injected;
    onInject?.(injected);

    // Keep the SVG sized to its container when the layout changes.
    const observer = new ResizeObserver(() => Blockly.svgResize(injected));
    observer.observe(element);

    return () => {
      observer.disconnect();
      injected.dispose();
      workspace.current = null;
    };
  }, []);

  useEffect(() => {
    const current = workspace.current;
    if (current && current.getTheme() !== theme) current.setTheme(theme);
  }, [theme]);

  return (
    <div className={className} style={style}>
      <div ref={container} className="h-full w-full text-left" />
    </div>
  );
}
