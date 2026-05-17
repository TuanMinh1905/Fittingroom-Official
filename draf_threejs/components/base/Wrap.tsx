// ===== TMFashion Wrap Component =====
// Layout wrapper max-width 1200px (tương đương components/base/Wrap.vue)

interface WrapProps {
  children: React.ReactNode;
  className?: string;
}

export default function Wrap({ children, className = "" }: WrapProps) {
  return (
    <div className={`max-w-[1200px] mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
