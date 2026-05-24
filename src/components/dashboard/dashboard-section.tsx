type DashboardSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-lg font-medium text-zinc-50">{title}</h2>
      </div>
      {children}
    </section>
  );
}
