const stats = [
  { value: "100,000+", label: "Experienced tutors" },
  { value: "300,000+", label: "5-star tutor reviews" },
  { value: "120+", label: "Subjects taught" },
  { value: "180+", label: "Tutor nationalities" },
  {
    value: "4.8 ★★★★★",
    label: "on the App Store",
  },
];

export function Stats() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <span className="text-2xl font-bold text-zinc-900 lg:text-3xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium text-zinc-600">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}