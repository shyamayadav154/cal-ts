import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import useMeasure from "react-use-measure";
import clsx from "clsx";

type ResizablePanelProps = {
  children: React.ReactNode;
  isShowBackAnimation?: boolean;
  animeKey?: string;
};
let duration = 0.2;

const animateVariant = {
  initial: { x: 400 },
  animate: {
    x: 0,
  },
  exit: { x: -400 },
};
function ResizablePanel({
  children,
  isShowBackAnimation,
  animeKey,
}: ResizablePanelProps) {
  const [ref, { height }] = useMeasure();
  const exitVariant = isShowBackAnimation ? "initial" : "exit";
  const initialVariant = isShowBackAnimation ? "exit" : "initial";
  return (
    <motion.div initial={{height}} animate={{ height }} className="overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={animeKey}
          // key={JSON.stringify(children, ignoreCircularReferences())}
          variants={animateVariant}
          initial={initialVariant}
          animate="animate"
          exit={exitVariant}
          transition={{ duration }}
          className="relative"
        >
          <div ref={ref} className={clsx("p-8 absolute inset-x-0 ")}>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default ResizablePanel;

// const ignoreCircularReferences = () => {
//   const seen = new WeakSet();
//   return (key: any, value: any) => {
//     if (key.startsWith("_")) return; // Don't compare React's internal props.
//     if (typeof value === "object" && value !== null) {
//       if (seen.has(value)) return;
//       seen.add(value);
//     }
//     return value;
//   };
// };
