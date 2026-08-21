export default function GlassCard({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`glass-panel p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
