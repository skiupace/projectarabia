import { createFileRoute, Link } from "@tanstack/react-router";
import { getPastMonthsFn } from "@/actions/get-feed";

export const Route = createFileRoute("/past/")({
  component: RouteComponent,
  loader: async () => {
    return await getPastMonthsFn();
  },
});

// Convert month string to Arabic format
function formatMonthArabic(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const arabicYear = year
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join("");

  const monthName = monthNames[parseInt(month, 10) - 1];
  return `${monthName} ${arabicYear}`;
}

function RouteComponent() {
  const { months } = Route.useLoaderData();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">الأرشيف</h1>

      {months.length === 0 ? (
        <div className="text-center text-zinc-500 py-8 text-sm">
          لا توجد منشورات في الأرشيف
        </div>
      ) : (
        <div className="space-y-2">
          {months.map(({ month, count }) => (
            <Link
              key={month}
              to="/past/$month"
              params={{ month }}
              className="block px-4 py-3 hover:bg-zinc-50 border border-zinc-200 rounded-sm transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-base font-mono">
                  {formatMonthArabic(month)}
                </span>
                <span className="text-sm text-zinc-500 font-mono">
                  {count} منشور
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
