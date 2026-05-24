type EmptyStateProps = {
  children: React.ReactNode;
};

export function EmptyState({ children }: EmptyStateProps) {
  return <div className="border-t border-white/10 p-5 text-sm text-zinc-500">{children}</div>;
}
