import React from 'react';
import { motion } from 'motion/react';

interface DimensionLineProps {
    label: string;
    orientation: 'horizontal' | 'vertical';
    className?: string;
    length?: string;
}

const DimensionLine: React.FC<DimensionLineProps> = ({ label, orientation, className = "", length = "100%" }) => {
    return (
        <div className={`relative flex items-center justify-center pointer-events-none ${className} ${orientation === 'horizontal' ? 'w-full h-4' : 'h-full w-4'}`}>
            {/* Main line */}
            <motion.div
                initial={{ scaleX: 0, scaleY: 0 }}
                animate={{ scaleX: 1, scaleY: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`bg-primary/30 ${orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-full'}`}
            />

            {/* End caps */}
            <div className={`absolute bg-primary/40 ${orientation === 'horizontal' ? 'h-3 w-[1px] left-0' : 'w-3 h-[1px] top-0'}`} />
            <div className={`absolute bg-primary/40 ${orientation === 'horizontal' ? 'h-3 w-[1px] right-0' : 'w-3 h-[1px] bottom-0'}`} />

            {/* Label */}
            <div className={`absolute bg-black px-2 font-mono text-[9px] text-primary/60 whitespace-nowrap`}>
                {label}
            </div>
        </div>
    );
};

export default DimensionLine;
