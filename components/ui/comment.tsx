/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
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

interface commentSectionProps {
  comments: Comment[];
  onSubmit: (data: CommentFormValues) => Promise<void>;
  loading: boolean;
}

export const CommentFormSchema = z.object({
  message: z.string().min(5),
});

export type CommentFormValues = z.infer<typeof CommentFormSchema>;

const CommentSection: React.FC<commentSectionProps> = ({
  comments,
  onSubmit,
  loading,
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
                    disabled={loading}
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
            className="bg-green-primary hover:bg-green-secondary text-white w-full"
            disabled={loading}
          >
            Kirim
          </Button>
        </form>
      </Form>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {comments.map((comment, index) => (
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
            {index !== comments.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
