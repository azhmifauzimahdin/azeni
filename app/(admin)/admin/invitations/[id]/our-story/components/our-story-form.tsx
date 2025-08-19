"use client";

import * as z from "zod";

import { Invitation } from "@/types";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormLabelText,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ImageService, StoryService } from "@/lib/services";
import toast from "react-hot-toast";
import axios from "axios";
import { handleError } from "@/lib/utils/handle-error";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { Pagination } from "@/components/ui/pagination";
import { createStorySchema } from "@/lib/schemas/story";
import { Textarea } from "@/components/ui/textarea";
import { OurStoryCard, OurStoryCardSkeleton } from "./our-story-card";
import ImageUpload from "./image-upload";
import DateInput from "@/components/ui/date-input";
import { getFolderFromInvitationId } from "@/lib/utils/get-folder-from-invitation-id";
import CreatableCombobox from "@/components/ui/creatable-combobox";
import { Img } from "@/components/ui/Img";
import useAdminInvitationStore from "@/stores/admin-invitation-store";

type OurStoryFormValues = z.infer<typeof createStorySchema>;
interface StoryFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const OurStoryForm: React.FC<StoryFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingStoryId, setUpdatingStoryId] = useState<string | null>(null);
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);
  const [deletingStoryName, setDeletingStoryName] = useState<string | null>(
    null
  );
  const [imageDelete, setImageDelete] = useState<string[]>([]);

  const addOrUpdateStoryToInvitation = useAdminInvitationStore(
    (state) => state.addOrUpdateStoryToInvitation
  );
  const deleteStoryFromInvitation = useAdminInvitationStore(
    (state) => state.deleteStoryFromInvitation
  );

  const form = useForm<OurStoryFormValues>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      title: "",
      date: new Date(),
      image: "",
      description: "",
    },
  });

  const onSubmit = async (data: OurStoryFormValues) => {
    try {
      setLoading(true);
      await deleteAllImages();
      let res;
      const request = { ...data, image: data.image || "" };
      if (updatingStoryId)
        res = await StoryService.updateStory(
          params.id,
          updatingStoryId,
          request
        );
      else res = await StoryService.createStory(params.id, request);
      addOrUpdateStoryToInvitation(params.id, res.data);
      toast.success("Cerita berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        title: "",
        date: new Date(),
        image: "",
        description: "",
      });
      setUpdatingStoryId(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error(error.response.data.message);
        } else {
          handleError(error, "schedule");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onDeleteImage = async (publicId: string) => {
    try {
      setLoading(true);
      await ImageService.deleteImageByPublicId(publicId);
    } catch (error) {
      handleError(error, "image");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllImages = async () => {
    await Promise.all(imageDelete.map((id) => onDeleteImage(id)));
    setImageDelete([]);
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingStoryId(id);
    setIsModalOpen(true);
    const story = initialData?.stories?.find((item) => item.id === id);
    form.reset({
      title: story?.title,
      date: new Date(story?.date || new Date().getTime()),
      image: story?.image,
      description: story?.description,
    });
  };

  const onDelete = async () => {
    try {
      if (!deletingStoryId) return;
      setLoading(true);
      await StoryService.deleteStory(params.id, deletingStoryId);
      toast.success("Cerita berhasil dihapus.");
      deleteStoryFromInvitation(params.id, deletingStoryId);
    } catch (error: unknown) {
      handleError(error, "bank");
    } finally {
      setLoading(false);
      setDeletingStoryId(null);
      setDeletingStoryName(null);
    }
  };

  const storiesPerPage = 10;
  const totalPages = Math.ceil(
    (initialData?.stories ?? []).length / storiesPerPage
  );
  const [currentPage, setCurrentPage] = useState(1);

  const currentstories = initialData?.stories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <Modal
        title={`${updatingStoryId ? "Ubah" : "Tambah"} Cerita`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingStoryId) {
            form.reset({
              title: "",
              date: new Date(),
              description: "",
              image: "",
            });
            setUpdatingStoryId(null);
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Judul
                  </FormLabel>
                  <FormControl>
                    <CreatableCombobox
                      id={field.name}
                      options={[
                        {
                          value: "Pertemuan",
                          label: "Pertemuan",
                          searchText: "pertemuan",
                        },
                        {
                          value: "Lamaran",
                          label: "Lamaran",
                          searchText: "lamaran",
                        },
                        {
                          value: "Pernikahan",
                          label: "Pernikahan",
                          searchText: "pernikahan",
                        },
                      ]}
                      placeholder="atau masukkan judul"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Tanggal
                  </FormLabel>
                  <FormControl>
                    <DateInput id={field.name} disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Deskripsi
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="Semua berawal dari sebuah pertemuan sederhana..."
                      disabled={loading}
                      className="h-44"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabelText>Foto</FormLabelText>
                  <FormControl>
                    <ImageUpload
                      id={field.name}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={(publicId) => {
                        setImageDelete((prev) => [...prev, publicId]);
                        field.onChange("");
                      }}
                      value={field.value || ""}
                      path={`users/stories/${getFolderFromInvitationId(
                        params.id
                      )}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row items-center justify-end gap-3">
              <Button
                variant="primary"
                isLoading={loading}
                className="w-full md:w-auto"
                type="submit"
              >
                {updatingStoryId ? (
                  <>
                    <Pencil />
                    Ubah
                  </>
                ) : (
                  <>
                    <Save />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <DeleteConfirmationModal
        description={`cerita ${deletingStoryName}`}
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingStoryId(null);
          setDeletingStoryName(null);
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="space-y-4 card-dashboard ">
        {isFetching ? (
          <div className="flex items-center gap-3 bg-muted text-muted-foreground rounded-lg shadow p-4 max-w-md animate-pulse">
            <div className="w-8 h-8 bg-skeleton rounded" />
            <div className="h-4 w-40 bg-skeleton rounded" />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-green-app-primary text-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-app-secondary max-w-md"
          >
            <Img
              src="/assets/img/love-story.png"
              alt="icon story"
              wrapperClassName="w-1/12 aspect-square"
              sizes="35px"
            />
            <span className="font-medium">Tambah Cerita</span>
          </div>
        )}
        <div className="text-base text-slate-600">Cerita</div>

        {isFetching ? (
          <div className="relative">
            <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4 pl-2">
              {[...Array(3)].map((_, i) => (
                <OurStoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (currentstories?.length ?? 0) > 0 ? (
          <div className="relative">
            <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4 pl-2">
              {(currentstories || []).map((story) => (
                <OurStoryCard
                  key={story.id}
                  data={story}
                  onClick={(id: string) => onOpenModalEdit(id)}
                  onDelete={(id: string, name: string) => {
                    setDeletingStoryId(id);
                    setDeletingStoryName(name);
                    setIsModalDeleteOpen(true);
                  }}
                  isLoadingDelete={deletingStoryId === story.id}
                />
              ))}
            </div>
          </div>
        ) : null}
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
    </>
  );
};

export default OurStoryForm;
