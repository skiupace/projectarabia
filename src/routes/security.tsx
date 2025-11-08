import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export const Route = createFileRoute("/security")({
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
                <h1 className="text-sm font-bold mb-1">الأمان</h1>
              </div>

              <div className="space-y-3 text-[10px] leading-tight">
                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    التزامنا بالأمان
                  </h3>
                  <p>
                    نأخذ أمان مستخدمينا على محمل الجد. نحن نطبق أفضل الممارسات
                    لحماية بياناتك وخصوصيتك.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">حماية الحساب</h3>
                  <ul className="list-disc mr-4 mt-1 space-y-0.5">
                    <li>
                      كلمات المرور مشفرة بشكل آمن باستخدام خوارزميات تشفير حديثة
                    </li>
                    <li>نحن لا نخزن كلمات المرور بشكل نصي واضح أبداً</li>
                    <li>استخدم كلمة مرور قوية وفريدة لحسابك</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">الخصوصية أولاً</h3>
                  <ul className="list-disc mr-4 mt-1 space-y-0.5">
                    <li>لا نتتبع عنوان IP الخاص بك</li>
                    <li>لا نستخدم بصمات المتصفح</li>
                    <li>لا نشارك بياناتك مع أطراف ثالثة</li>
                    <li>البريد الإلكتروني اختياري تماماً</li>
                  </ul>
                  <p className="mt-1">
                    اقرأ{" "}
                    <Link
                      to="/legal"
                      className="text-[#006CFF] hover:underline"
                    >
                      سياسة الخصوصية
                    </Link>{" "}
                    الكاملة لمزيد من التفاصيل.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">
                    الإبلاغ عن ثغرات أمنية
                  </h3>
                  <p>
                    إذا اكتشفت ثغرة أمنية، يرجى الإبلاغ عنها بشكل مسؤول عن طريق
                    التواصل معنا مباشرة عبر{" "}
                    <a
                      href="https://x.com/v0id_user"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#006CFF] hover:underline"
                    >
                      @v0id_user
                    </a>
                    . نحن نقدر الإفصاح المسؤول ونلتزم بمعالجة المشاكل بسرعة.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">نصائح أمنية</h3>
                  <ul className="list-disc mr-4 mt-1 space-y-0.5">
                    <li>لا تشارك كلمة مرورك مع أي شخص</li>
                    <li>استخدم كلمة مرور فريدة لبابل</li>
                    <li>قدم بريداً إلكترونياً لتمكين استعادة الحساب</li>
                    <li>كن حذراً من محاولات التصيد الاحتيالي</li>
                    <li>تسجيل الخروج من الأجهزة المشتركة</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] mb-1">البنية التحتية</h3>
                  <p>
                    بابل مبني باستخدام تقنيات حديثة وآمنة. يتم استضافة جميع
                    البيانات بشكل آمن ومحمية ضد الوصول غير المصرح به.
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
