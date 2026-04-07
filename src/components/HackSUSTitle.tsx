import { cn } from "@/lib/utils";

type HackSUSTitleProps = {
  className?: string;
};

const HackSUSTitle = ({ className }: HackSUSTitleProps) => {
  return (
    <span className={cn("hacksus-lockup", className)}>
      <span className="sr-only">HackS'US</span>
      <span className="hacksus-h" aria-hidden="true" />
      <span className="hacksus-word" aria-hidden="true">
        <span className="hacksus-word-face" data-text="ackS'US">
          ackS'US
        </span>
      </span>
      <span className="hacksus-swatches" aria-hidden="true">
        <span className="hacksus-swatch hacksus-swatch--1" />
        <span className="hacksus-swatch hacksus-swatch--2" />
        <span className="hacksus-swatch hacksus-swatch--3" />
        <span className="hacksus-swatch hacksus-swatch--4" />
      </span>
    </span>
  );
};

export default HackSUSTitle;
