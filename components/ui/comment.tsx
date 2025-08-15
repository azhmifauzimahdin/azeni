"use client";

import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./form";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Comment, Invitation } from "@/types";
import { z } from "zod";
import { createCommentSchema } from "@/lib/schemas/comment";
import { Pagination } from "./pagination";
import {
  Clock,
  CornerUpLeft,
  Loader2,
  MoreVertical,
  Send,
  X,
} from "lucide-react";
import { CommentService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";

const insertComment = (comments: Comment[], newComment: Comment): Comment[] => {
  if (!newComment.parentId) {
    return [newComment, ...comments];
  }

  return comments.map((comment) => {
    if (comment.id === newComment.parentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newComment],
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: insertComment(comment.replies, newComment),
      };
    }

    return comment;
  });
};

const removeComment = (comments: Comment[], id: string): Comment[] => {
  return comments
    .filter((comment) => comment.id !== id)
    .map((comment) => ({
      ...comment,
      replies: comment.replies ? removeComment(comment.replies, id) : [],
    }));
};

interface commentSectionProps {
  invitation: Invitation;
  comments: Comment[];
  setInvitation: React.Dispatch<React.SetStateAction<Invitation>>;
  buttonClassName?: string;
}

const CommentFormSchema = createCommentSchema.pick({
  message: true,
});

export type CommentFormValues = z.infer<typeof CommentFormSchema> & {
  parentId?: string | null;
  replyToName?: string | null;
  isReply?: boolean;
};
const CommentSection: React.FC<commentSectionProps> = ({
  invitation,
  comments,
  setInvitation,
  buttonClassName = "bg-green-primary hover:bg-green-secondary text-white",
}) => {
  const { user } = useUser();

  const [isReply, setIsReply] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyToName, setReplyToName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleFormSubmit = async (data: CommentFormValues) => {
    try {
      setIsSubmitting(true);

      const res = await CommentService.postComment(invitation.id, {
        ...data,
        guestId: invitation.guest.id,
        parentId: replyTo,
        replyToName,
        isReply,
      });

      setInvitation((prev) => ({
        ...prev,
        comments: insertComment(prev.comments || [], res.data),
      }));

      toast.success("Berhasil menambahkan ucapan");

      form.reset();
      setIsReply(false);
      setReplyTo(null);
      setReplyToName(null);
    } catch (error: unknown) {
      handleError(error, "invitation");
      toast.error("Gagal menambahkan ucapan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      setDeletingCommentId(id);
      setIsDeleting(true);
      await CommentService.deleteComment(invitation.id, id);

      setInvitation((prev) => ({
        ...prev,
        comments: removeComment(prev.comments || [], id),
      }));

      toast.success("Berhasil menghapus ucapan");
    } catch (error: unknown) {
      handleError(error, "invitation");
      toast.error("Gagal menambahkan ucapan");
    } finally {
      setIsDeleting(false);
      setDeletingCommentId(null);
    }
  };

  const commentsPerPage = 10;
  const totalPages = Math.ceil((comments ?? []).length / commentsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentcomments = comments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  const handleReply = (
    commentId: string,
    replyToName: string,
    isReply: boolean
  ) => {
    setIsReply(isReply);
    setReplyTo(commentId);
    setReplyToName(replyToName);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const cancelReply = () => {
    setIsReply(false);
    setReplyTo(null);
    setReplyToName(null);
  };

  return (
    <div className="bg-slate-50 rounded-md p-5 shadow" data-aos="fade-up">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="relative w-full mb-5"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                {replyTo && replyToName && (
                  <div className="mb-2 flex items-center justify-between px-4 py-2 bg-green-app-primary/10 text-green-app-primary text-sm rounded-md shadow-sm">
                    <div className="flex items-center gap-2">
                      <CornerUpLeft className="w-4 h-4" />
                      <span className="truncate">
                        Membalas&nbsp;
                        <span className="capitalize font-medium">
                          @{replyToName}
                        </span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="hover:text-green-app-primary/80 ml-2"
                      onClick={cancelReply}
                      aria-label="Batal membalas"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <FormControl>
                  <div className="relative flex items-end">
                    <Textarea
                      placeholder="Ucapan"
                      disabled={isSubmitting}
                      className="h-44 flex-1"
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        textareaRef.current = e;
                      }}
                    />

                    <Button
                      type="submit"
                      size="icon"
                      variant="primary"
                      className={cn(
                        "ml-2 w-8 h-8 mb-1 p-0 flex items-center justify-center rounded-full",
                        buttonClassName
                      )}
                      disabled={isSubmitting}
                      aria-label="Kirim"
                      isLoading={isSubmitting}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="space-y-4">
        {currentcomments.map((comment) => (
          <div key={comment.id} className="flex flex-col space-y-2">
            <div className="bg-gray-50 p-4 rounded-2xl shadow-sm max-w-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-green-app-primary truncate capitalize">
                  {comment.guest.name}
                </h4>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </div>
                  {user?.id && invitation.userId === user.id && (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {isDeleting && deletingCommentId === comment.id ? (
                            <Loader2 className="absolute h-5 w-5 animate-spin" />
                          ) : (
                            <MoreVertical className="h-5 w-5" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            handleDeleteComment(comment.id);
                          }}
                          className="text-red-600 focus:text-red-600 text-xs cursor-pointer"
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {comment.message}
              </p>

              <button
                type="button"
                className="mt-2 text-xs text-green-app-primary hover:underline focus:outline-none focus:ring-2 focus:ring-green-app-primary rounded"
                onClick={() =>
                  handleReply(comment.id, comment.guest.name, false)
                }
                aria-label={`Balas komentar dari ${comment.guest.name}`}
              >
                Balas
              </button>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 flex flex-col space-y-2">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white p-3 rounded-xl shadow-sm max-w-lg  hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-green-app-primary truncate capitalize">
                        {reply.guest.name}
                        {reply.isReply && ` ▸ ${reply.replyToName}`}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </div>
                        {user?.id && invitation.userId === user.id && (
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                {isDeleting &&
                                deletingCommentId === reply.id ? (
                                  <Loader2 className="absolute h-5 w-5 animate-spin" />
                                ) : (
                                  <MoreVertical className="h-5 w-5" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeleteComment(reply.id);
                                }}
                                className="text-red-600 focus:text-red-600 text-xs cursor-pointer"
                              >
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {reply.message}
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs text-green-app-primary hover:underline focus:outline-none focus:ring-2 focus:ring-green-app-primary rounded"
                      onClick={() =>
                        handleReply(comment.id, reply.guest.name, true)
                      }
                      aria-label={`Balas komentar dari ${comment.guest.name}`}
                    >
                      Balas
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            siblingCount={1}
          />
        </div>
      )}
    </div>
  );
};

export default CommentSection;
