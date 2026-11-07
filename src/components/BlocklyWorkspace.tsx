import { useEffect, useRef, type CSSProperties } from "react";
// The full package (not blockly/core) registers the built-in blocks and messages.
import * as Blockly from "blockly";
import Theme from "@blockly/theme-modern";

type Props = {
  options: Blockly.BlocklyOptions;
  /** Called once with the injected workspace (and again after a remount). */
  onInject?: (workspace: Blockly.WorkspaceSvg) => void;
  className?: string;
  style?: CSSProperties;
};

export function BlocklyWorkspace({
  options,
  onInject,
  className,
  style,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  // Inject only on mount; later prop changes don't re-create the workspace.
  const initial = useRef({ options, onInject });

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const { options, onInject } = initial.current;
    const workspace = Blockly.inject(element, { theme: Theme, ...options });
    onInject?.(workspace);

    // Keep the SVG sized to its container when the layout changes.
    const observer = new ResizeObserver(() => Blockly.svgResize(workspace));
    observer.observe(element);

    return () => {
      observer.disconnect();
      workspace.dispose();
    };
  }, []);

  return (
    <div className={className} style={style}>
      <div ref={container} className="h-full w-full text-left" />
    </div>
  );
}
