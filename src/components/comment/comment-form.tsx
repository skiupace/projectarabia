import {
  commentFormOpts,
  type CommentSubmission,
} from "@/schemas/forms/comment";
import { useForm } from "@tanstack/react-form";

export interface CommentFormProps {
  parentId?: string | null;
  onSubmit: (submission: CommentSubmission) => void;
  onCancel?: () => void;
  placeholder?: string;
  isReply?: boolean;
  postId: string;
}

export default function CommentForm({
  parentId = null,
  onSubmit,
  onCancel,
  placeholder = "أضف تعليقك...",
  isReply = false,
  postId,
}: CommentFormProps) {
  const form = useForm({
    ...commentFormOpts,
    defaultValues: {
      comment: {
        text: "",
        parentId: parentId,
        postId: postId,
      },
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      // Reset form after submission
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={`w-full ${isReply ? "mt-2" : "mb-4"}`}
    >
      <form.Field
        name="comment.text"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.trim() === "") {
              return "النص مطلوب";
            }
            if (value.length < 2) {
              return "التعليق قصير جداً";
            }
            if (value.length > 512) {
              return "التعليق طويل جداً (الحد الأقصى 512 حرف)";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="mb-2">
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder={placeholder}
              className="w-full px-2 py-1.5 text-xs font-mono border border-zinc-300 rounded focus:outline-none focus:border-[#006CFF] focus:ring-1 focus:ring-[#006CFF] min-h-[80px] resize-y text-right"
              dir="rtl"
            />
            {field.state.meta.errors && field.state.meta.errors.length > 0 && (
              <span className="text-red-500 text-[10px] mt-1 block">
                {field.state.meta.errors[0]}
              </span>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex items-center gap-2">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-2 py-0.5 text-[10px] border border-gray-400 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال"}
            </button>
          )}
        </form.Subscribe>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-[10px] font-mono text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}
