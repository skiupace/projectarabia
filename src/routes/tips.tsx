import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

export const Route = createFileRoute("/tips")({
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
                <h1 className="text-sm font-bold mb-1">
                  نصائح لنشر عملك على بابل
                </h1>
                <p className="text-[9px] text-gray-600">
                  <em>
                    هذه النصائح مأخوذة من Hacker News وتم تكييفها لمجتمع بابل
                  </em>
                </p>
              </div>

              <div className="space-y-2">
                <section>
                  <h2 className="font-bold text-xs mb-1">
                    عند مشاركة عملك الخاص
                  </h2>
                  <div className="space-y-1 text-[10px] leading-tight">
                    <p>
                      <strong>استخدم عنواناً واضحاً:</strong> إذا كنت تشارك مشروعك
                      أو منتجك الخاص وهناك طريقة لتجربته، ضع "اسأل بابل" أو
                      "شارك بابل" في بداية العنوان حسب طبيعة المشروع.
                    </p>
                    <br />

                    <p>
                      <strong>اشرح القصة:</strong> أضف نصاً يشرح كيف بدأت العمل
                      على هذا المشروع، وما الذي يميزه عن غيره. هذا يساعد في بدء
                      نقاش مثمر. يجب أن يظهر النص أعلى المنشور، أو أضفه كأول
                      تعليق في الموضوع.
                    </p>
                    <br />

                    <p>
                      <strong>وضّح ماهية مشروعك:</strong> قدم بياناً واضحاً عما
                      يفعله مشروعك. إذا لم تفعل، ستتكون التعليقات من "لا أستطيع
                      معرفة ما هو هذا".
                    </p>
                    <br />

                    <p>
                      <strong>أضف روابط سابقة:</strong> إذا كان هناك نقاشات
                      سابقة على بابل متعلقة بمشروعك، أضف روابطها. القراء يحبون
                      ذلك.
                    </p>
                    <br />

                    <p>
                      <strong>تجنب لغة التسويق:</strong> احذف أي لغة تبدو
                      تسويقية أو ترويجية. في بابل، هذا ينفر القراء فوراً. استخدم
                      لغة واقعية ومباشرة. القصص الشخصية والتفاصيل التقنية رائعة.
                    </p>
                    <br />
                  </div>
                </section>

                <section>
                  <h2 className="font-bold text-xs mb-1">متطلبات المشروع</h2>
                  <div className="space-y-1 text-[10px] leading-tight">
                    <p>
                      <strong>يجب أن يكون موجوداً:</strong> المنتج أو المشروع يجب
                      أن يكون موجوداً فعلياً ويمكن للناس تجربته. لا يمكن أن يكون
                      مجرد صفحة هبوط أو اختبار سوق أو حملة تبرعات أو مقال مدونة
                      أو قائمة منسقة. يرجى احترام هذه القاعدة.
                    </p>
                    <br />

                    <p>
                      <strong>سهّل التجربة:</strong> اجعل من السهل على المستخدمين
                      تجربة مشروعك، ويفضل بدون الحاجة للتسجيل، أو تأكيد البريد
                      الإلكتروني، أو غيرها من العوائق. ستحصل على ملاحظات أكثر
                      بهذه الطريقة، كما أن مستخدمي بابل يضيقون ذرعاً إذا جعلتهم
                      يقفزون عبر العقبات.
                    </p>
                    <br />

                    <p>
                      <strong>للأجهزة والمنتجات المادية:</strong> إذا كان مشروعك
                      عبارة عن جهاز أو شيء ليس من السهل تجربته عبر الإنترنت،
                      ابحث عن طريقة مختلفة لإظهار كيف يعمل—مثل فيديو أو منشور
                      مفصل مع صور.
                    </p>
                    <br />
                  </div>
                </section>

                <section>
                  <h2 className="font-bold text-xs mb-1">حسابك وهويتك</h2>
                  <div className="space-y-1 text-[10px] leading-tight">
                    <p>
                      <strong>اسم المستخدم:</strong> لا تجعل اسم المستخدم الخاص
                      بك باسم شركتك أو مشروعك. هذا يخلق شعوراً باستخدام بابل
                      للترويج وليس كمشارك فعلي. لا يجب أن تستخدم اسمك الحقيقي،
                      فقط شيء يدل على أنك هنا كإنسان، وليس كعلامة تجارية.
                    </p>
                    <br />

                    <p>
                      <strong>معلومات التواصل:</strong> إذا كنت مرتاحاً، ضع عنوان
                      بريدك الإلكتروني في ملفك الشخصي حتى نتمكن من التواصل معك
                      إذا لاحظنا أي شيء، وأيضاً حتى نتمكن من إرسال دعوة لإعادة
                      النشر لك عند الحاجة.
                    </p>
                    <br />
                  </div>
                </section>

                <section>
                  <h2 className="font-bold text-xs mb-1">التفاعل والنقاش</h2>
                  <div className="space-y-1 text-[10px] leading-tight">
                    <p>
                      <strong>تجنب التعليقات الترويجية:</strong> تأكد من أن
                      أصدقاءك ومستخدميك لا يضيفون تعليقات داعمة في الموضوع.
                      مستخدمو بابل بارعون في اكتشاف ذلك، ويعتبرونه spam،
                      وسيهاجمونك بسببه. إذا كان لدى صديق أو معجب شيء مثير
                      للاهتمام ليقوله، فهذا جيد، لكن التعليقات يجب ألا تكون
                      ترويجية.
                    </p>
                    <br />

                    <p>
                      <strong>إعادة النشر:</strong> يمكنك نشر إصدار جديد فقط إذا
                      كان الإصدار الجديد مختلفاً بشكل كبير. لا يجب أن يكون مجرد
                      ترقية تدريجية. إذا أعدت النشر، أضف تعليقاً يربط بالمنشور
                      السابق ويشرح ما هو المختلف هذه المرة. يجب أن يحدث هذا مرة
                      أو مرتين في السنة فقط—أكثر من ذلك يبدأ في أن يكون مفرطاً.
                    </p>
                    <br />
                  </div>
                </section>

                <section>
                  <h2 className="font-bold text-xs mb-1">نصائح عامة</h2>
                  <div className="space-y-1 text-[10px] leading-tight">
                    <p>
                      <strong>كن صادقاً:</strong> شارك تحديات وصعوبات المشروع،
                      وليس فقط النجاحات. المجتمع يقدر الصدق والشفافية.
                    </p>
                    <br />

                    <p>
                      <strong>استجب للملاحظات:</strong> تفاعل مع التعليقات
                      والأسئلة بشكل مدروس. لكن لا تكن دفاعياً—تقبل النقد البناء
                      بصدر رحب.
                    </p>
                    <br />

                    <p>
                      <strong>التوقيت:</strong> اختر وقتاً مناسباً للنشر عندما
                      يكون المجتمع أكثر نشاطاً. عادة ما تكون أوقات الذروة خلال
                      ساعات العمل في المنطقة العربية.
                    </p>
                    <br />

                    <p>
                      <strong>كن جزءاً من المجتمع:</strong> لا تستخدم بابل فقط
                      للترويج لعملك. شارك في النقاشات، علق على منشورات الآخرين،
                      وكن عضواً فعالاً في المجتمع.
                    </p>
                    <br />
                  </div>
                </section>

                <div className="mt-3 pt-1 border-t-2 border-[#006CFF]">
                  <div className="text-center text-[9px] text-gray-600 py-1">
                    <a href="/" className="text-[#006CFF] hover:underline">
                      العودة للرئيسية
                    </a>
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
