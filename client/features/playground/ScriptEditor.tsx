import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { Block } from './Playground';
import styles from './ScriptEditor.module.css';
type ScriptPaletteProps = {
  BLOCKS: { id: number; contents: string[] }[];
  setTargetBlockId: Dispatch<SetStateAction<number | null>>;
};
const ScriptPalette = (scriptPaletteProps: ScriptPaletteProps) => {
  const { BLOCKS, setTargetBlockId } = scriptPaletteProps;
  const ref = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  });
  return (
    <div className={styles.scriptPalette}>
      {BLOCKS.map((block) => (
        <div
          key={block.id}
          className={styles.block}
          draggable
          onDragStart={() => setTargetBlockId(block.id)}
        >
          {block.contents.map((content, i) =>
            content.startsWith('$') ? (
              <input className={styles.input} key={i} type="text" value={10} />
            ) : (
              <div key={i}>{content}</div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

type ScriptEditSpaceProps = {
  script: Block[] | undefined;
  setScript: Dispatch<SetStateAction<Block[] | undefined>>;
  BLOCKS: { id: number; contents: string[] }[];
  targetBlockId: number | null;
};

const ScriptEditSpace = (scriptEditSpaceProps: ScriptEditSpaceProps) => {
  const { script, setScript, BLOCKS, targetBlockId } = scriptEditSpaceProps;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (targetBlockId === null) return;
    const newScript = structuredClone(script ?? []);
    newScript.push({ id: targetBlockId, arg: ['10'] });
    setScript(newScript);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={styles.scriptEditSpace} onDrop={handleDrop} onDragOver={handleDragOver}>
      {script?.map((block) => (
        <div className={styles.block}>
          {BLOCKS.find((b) => b.id === block.id)?.contents.map((content, i) =>
            content.startsWith('$') ? (
              <input className={styles.input} key={i} type="text" value={10} />
            ) : (
              <div key={i}>{content}</div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

type Props = {
  script: Block[] | undefined;
  setScript: Dispatch<SetStateAction<Block[] | undefined>>;
  BLOCKS: { id: number; contents: string[] }[];
};
export const ScriptEditor = (props: Props) => {
  const [targetBlockId, setTargetBlockId] = useState<number | null>(null);
  const { script, setScript, BLOCKS } = props;
  return (
    <div className={styles.main}>
      <ScriptPalette BLOCKS={BLOCKS} setTargetBlockId={setTargetBlockId} />
      <ScriptEditSpace
        script={script}
        setScript={setScript}
        BLOCKS={BLOCKS}
        targetBlockId={targetBlockId}
      />
    </div>
  );
};
