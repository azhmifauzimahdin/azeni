"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./form";
import { useForm } from "react-hook-form";
import { Textarea } from "./textarea";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Separator } from "./separator";
import clsx from "clsx";
import { Comment } from "@/types";
import { z } from "zod";
import { createCommentSchema } from "@/lib/schemas/comment";
import { Pagination } from "./pagination";
import { cn } from "@/lib/utils";

interface commentSectionProps {
  comments: Comment[];
  onSubmit: (data: CommentFormValues) => Promise<void>;
  isLoading: boolean;
  buttonClassName?: string;
}

const CommentFormSchema = createCommentSchema.pick({
  message: true,
});

export type CommentFormValues = z.infer<typeof CommentFormSchema>;

const CommentSection: React.FC<commentSectionProps> = ({
  comments,
  onSubmit,
  isLoading,
  buttonClassName = "bg-green-primary hover:bg-green-secondary",
}) => {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleFormSubmit = async (data: CommentFormValues) => {
    await onSubmit(data);
    form.reset();
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

  return (
    <div className="bg-slate-50 rounded-md p-5 shadow" data-aos="fade-up">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4 w-full mb-5"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Ucapan"
                    disabled={isLoading}
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="default"
            className={cn("w-full", buttonClassName)}
            isLoading={isLoading}
          >
            Kirim
          </Button>
        </form>
      </Form>

      <div className="space-y-3">
        {currentcomments.map((comment, index) => (
          <React.Fragment key={index}>
            <div className="flex gap-3">
              <div>
                <div
                  className={clsx(
                    "flex justify-center items-center w-10 h-10 text-white text-center rounded-full",
                    comment.guest.color
                  )}
                >
                  {comment.guest.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 truncate capitalize">
                  {comment.guest.name}
                </h4>
                <span className="text-sm text-gray-500 truncate">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {comment.message}
                </p>
              </div>
            </div>
            {index !== currentcomments.length - 1 && <Separator />}
          </React.Fragment>
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
