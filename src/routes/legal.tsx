import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export const Route = createFileRoute("/legal")({
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
                <h1 className="text-sm font-bold mb-1">القانونية</h1>
              </div>

              <div className="space-y-4">
                {/* Privacy Policy */}
                <section>
                  <h2 className="font-bold text-xs mb-2">سياسة الخصوصية</h2>
                  <div className="space-y-2 text-[10px] leading-tight">
                    <p className="text-[9px] text-gray-600 italic">
                      آخر تحديث: أكتوبر 2025
                    </p>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        1. المعلومات التي نجمعها
                      </h3>
                      <p>
                        بابل يحترم خصوصيتك. نحن نجمع الحد الأدنى من المعلومات
                        اللازمة لتشغيل الخدمة:
                      </p>
                      <ul className="list-disc mr-4 mt-1 space-y-0.5">
                        <li>
                          <strong>البريد الإلكتروني (اختياري):</strong> يمكنك
                          اختيار تقديم بريدك الإلكتروني للتحقق من الحساب
                          واستعادة كلمة المرور.
                        </li>
                        <li>
                          <strong>المحتوى:</strong> المنشورات والتعليقات
                          والتصويتات التي تقوم بها على المنصة.
                        </li>
                        <li>
                          <strong>معلومات الحساب:</strong> اسم المستخدم وكلمة
                          المرور التي تقوم بإنشائها.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        2. ما لا نجمعه
                      </h3>
                      <p>نحن لا نجمع:</p>
                      <ul className="list-disc mr-4 mt-1 space-y-0.5">
                        <li>عناوين IP</li>
                        <li>بصمات المتصفح أو الأجهزة</li>
                        <li>بيانات تحليلات طرف ثالث</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        3. كيف نستخدم المعلومات
                      </h3>
                      <p>نستخدم المعلومات المجمعة فقط من أجل:</p>
                      <ul className="list-disc mr-4 mt-1 space-y-0.5">
                        <li>تقديم وصيانة الخدمة</li>
                        <li>
                          التحقق من الحسابات (إذا تم تقديم البريد الإلكتروني)
                        </li>
                        <li>منع إساءة الاستخدام والبريد العشوائي</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        4. مشاركة البيانات
                      </h3>
                      <p>
                        نحن لا نبيع أو نشارك أو نكشف عن معلوماتك الشخصية لأطراف
                        ثالثة. المحتوى الذي تنشره (المنشورات والتعليقات) متاح
                        للعامة.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        5. حذف البيانات
                      </h3>
                      <p>
                        يمكنك طلب حذف حسابك في أي وقت عن طريق الاتصال بنا. يرجى
                        ملاحظة أن المنشورات والتعليقات العامة قد تبقى على
                        المنصة.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        6. التغييرات على هذه السياسة
                      </h3>
                      <p>
                        قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. إذا
                        أجرينا تغييرات جوهرية، سنخطرك عبر البريد الإلكتروني (إذا
                        قدمته) أو من خلال إشعار بارز على المنصة.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Terms of Use */}
                <section className="pt-2 border-t border-gray-300">
                  <h2 className="font-bold text-xs mb-2">شروط الاستخدام</h2>
                  <div className="space-y-2 text-[10px] leading-tight">
                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        1. قبول الشروط
                      </h3>
                      <p>
                        باستخدام بابل، فإنك توافق على الالتزام بشروط الاستخدام
                        هذه. إذا كنت لا توافق، يرجى عدم استخدام الخدمة.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        2. استخدام الخدمة
                      </h3>
                      <p>أنت توافق على:</p>
                      <ul className="list-disc mr-4 mt-1 space-y-0.5">
                        <li>استخدام المنصة بطريقة محترمة ومسؤولة</li>
                        <li>عدم نشر محتوى غير قانوني أو ضار أو مسيء</li>
                        <li>عدم محاولة إزعاج أو إتلاف الخدمة</li>
                        <li>
                          اتباع{" "}
                          <Link
                            to="/guides"
                            className="text-[#006CFF] hover:underline"
                          >
                            الإرشادات
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">3. المحتوى</h3>
                      <p>
                        أنت مسؤول عن المحتوى الذي تنشره. بنشر المحتوى، فإنك تمنح
                        بابل ترخيصًا غير حصري لعرض وتوزيع هذا المحتوى على المنصة.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        4. إنهاء الحساب
                      </h3>
                      <p>
                        نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه
                        الشروط أو تسيء استخدام المنصة.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        5. إخلاء المسؤولية
                      </h3>
                      <p>
                        يتم تقديم الخدمة "كما هي" بدون ضمانات من أي نوع. نحن
                        لسنا مسؤولين عن أي أضرار ناتجة عن استخدام المنصة.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">
                        6. التغييرات على الشروط
                      </h3>
                      <p>
                        قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك في
                        استخدام الخدمة بعد التغييرات يشكل قبولك للشروط الجديدة.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contact & Copyright */}
                <section className="pt-2 border-t border-gray-300">
                  <div className="space-y-2 text-[10px] leading-tight">
                    <div>
                      <h3 className="font-bold text-[10px] mb-1">تواصل معنا</h3>
                      <p>
                        للأسئلة أو المخاوف المتعلقة بالخصوصية أو الشروط، يرجى
                        التواصل معنا عبر{" "}
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

                    <div>
                      <h3 className="font-bold text-[10px] mb-1">حقوق النشر</h3>
                      <p className="text-gray-600">
                        © 2025 بابل. صُنع بـ ♥ بواسطة{" "}
                        <a
                          href="https://x.com/v0id_user"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          V0ID#
                        </a>
                      </p>
                    </div>
                  </div>
                </section>

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
    </div>
  );
}
