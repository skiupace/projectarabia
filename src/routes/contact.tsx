import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export const Route = createFileRoute("/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="fixed inset-0 bg-white overflow-auto font-mono">
      <div className="flex justify-center py-2">
        <div className="w-full max-w-xl px-2">
          <div className="bg-[#fafaf0]">
            <div className="bg-[#006CFF] p-0.5">
              <Link to="/">
                <Image
                  src="/babel-logo-text.png"
                  width={150}
                  height={30}
                  layout="fixed"
                  alt="Babel Logo"
                  className="max-w-[120px] h-auto"
                />
              </Link>
            </div>

            <div className="px-3 py-2">
              <div className="mb-3">
                <h1 className="text-sm font-bold mb-1">تواصل</h1>
              </div>

              <div className="space-y-3 text-[10px] leading-tight">
                <div>
                  <h3 className="font-bold text-[10px] mb-1">تواصل معنا</h3>
                  <p>
                    للأسئلة أو الملاحظات أو المخاوف، يمكنك التواصل معنا عبر:
                  </p>
                </div>

                <div className="border border-gray-300 bg-white p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">X (Twitter):</span>
                    <a
                      href="https://x.com/v0id_user"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#006CFF] hover:underline"
                    >
                      @v0id_user
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    ماذا يمكننا مساعدتك به؟
                  </h3>
                  <ul className="list-disc mr-4 space-y-0.5">
                    <li>الإبلاغ عن محتوى غير لائق</li>
                    <li>مشاكل الحساب أو استعادته</li>
                    <li>الثغرات الأمنية</li>
                    <li>اقتراحات لتحسين المنصة</li>
                    <li>الشراكات أو التعاون</li>
                    <li>استفسارات عامة</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">قبل التواصل</h3>
                  <p>يرجى مراجعة:</p>
                  <ul className="list-disc mr-4 mt-1 space-y-0.5">
                    <li>
                      <Link
                        to="/faq"
                        className="text-[#006CFF] hover:underline"
                      >
                        الأسئلة الشائعة
                      </Link>{" "}
                      - قد تكون إجابتك موجودة هنا
                    </li>
                    <li>
                      <Link
                        to="/guides"
                        className="text-[#006CFF] hover:underline"
                      >
                        الإرشادات
                      </Link>{" "}
                      - لأسئلة حول القواعد والسلوك
                    </li>
                    <li>
                      <Link
                        to="/legal"
                        className="text-[#006CFF] hover:underline"
                      >
                        القانونية
                      </Link>{" "}
                      - لسياسة الخصوصية والشروط
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-300 pt-2 mt-3">
                  <p className="text-[9px] text-gray-600">
                    نحن نسعى جاهدين للرد في أسرع وقت ممكن. شكراً لصبرك وفهمك.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-1 border-t-2 border-[#006CFF]">
                <div className="text-center text-[9px] text-gray-600 py-1">
                  <Link to="/" className="text-[#006CFF] hover:underline">
                    العودة للرئيسية
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
