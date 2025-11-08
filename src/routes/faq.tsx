import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export const Route = createFileRoute("/faq")({
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
                <h1 className="text-sm font-bold mb-1">الأسئلة الشائعة</h1>
              </div>

              <div className="space-y-3 text-[10px] leading-tight">
                <div>
                  <h3 className="font-bold text-[10px] mb-1">ما هو بابل؟</h3>
                  <p>
                    بابل هو مجتمع عربي للمبرمجين ورواد الأعمال وأي شخص يهتم
                    بالتكنولوجيا. مستوحى من Hacker News، بابل يركز على المحتوى
                    الفكري والمناقشات العميقة.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    كيف يعمل نظام التصويت؟
                  </h3>
                  <p>
                    يمكن للمستخدمين التصويت على المنشورات والتعليقات. تظهر
                    المحتوى الأكثر تصويتاً في الأعلى. نحن نستخدم خوارزمية ترتيب
                    تأخذ في الاعتبار الوقت والتصويتات لإبقاء المحتوى حديثاً.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    هل أحتاج إلى حساب للمشاركة؟
                  </h3>
                  <p>
                    نعم، تحتاج إلى حساب لنشر المحتوى والتعليق والتصويت. لكن
                    يمكنك تصفح الموقع بدون حساب.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    هل البريد الإلكتروني مطلوب؟
                  </h3>
                  <p>
                    البريد الإلكتروني اختياري. يمكنك إنشاء حساب بدون بريد
                    إلكتروني، لكن توفيره يساعد في استعادة الحساب والتحقق.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">ما هي القواعد؟</h3>
                  <p>
                    كن محترماً وفضولياً. اقرأ{" "}
                    <Link
                      to="/guides"
                      className="text-[#006CFF] hover:underline"
                    >
                      الإرشادات
                    </Link>{" "}
                    الكاملة لمعرفة المزيد.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    كيف يمكنني الإبلاغ عن محتوى غير لائق؟
                  </h3>
                  <p>
                    يمكنك الإبلاغ عن المنشورات أو التعليقات المخالفة عن طريق
                    التواصل معنا مباشرة.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    ما نوع المحتوى المرحب به؟
                  </h3>
                  <p>
                    نرحب بالمحتوى الذي يثير الفضول الفكري: البرمجة، التكنولوجيا،
                    الشركات الناشئة، العلوم، التصميم، وأي شيء يثير تفكير
                    المبرمجين الجيدين.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">من يدير بابل؟</h3>
                  <p>
                    بابل مشروع مفتوح المصدر من قبل{" "}
                    <a
                      href="https://x.com/v0id_user"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#006CFF] hover:underline"
                    >
                      @v0id_user
                    </a>
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
