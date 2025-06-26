"use client";

import { Invitation } from "@/types";
import WaveformPlayer from "@/components/ui/wave-form-player";
import useUserMusics from "@/hooks/use-user-music";
import { InvitationService } from "@/lib/services";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import useInvitationStore from "@/stores/invitation-store";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Music } from "lucide-react";

interface MusicFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const MusicForm: React.FC<MusicFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const { musics } = useUserMusics();
  const [selectMusicId, setselectMusicId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const musicsPerPage = 10;

  const updateMusicInInvitation = useInvitationStore(
    (state) => state.updateMusicInInvitation
  );

  const onSelectSong = async (musicId: string) => {
    try {
      setselectMusicId(musicId);
      const res = await InvitationService.updateMusicByUserId(params.id, {
        musicId,
      });
      updateMusicInInvitation(params.id, res);
      toast.success("Musik berhasil dipilih.");
    } catch (error: unknown) {
      handleError(error, "music");
    } finally {
      setselectMusicId(null);
    }
  };

  const filteredMusics = useMemo(() => {
    return musics.filter((music) =>
      music.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [musics, searchTerm]);

  const totalPages = Math.ceil(filteredMusics.length / musicsPerPage);

  const currentMusics = filteredMusics.slice(
    (currentPage - 1) * musicsPerPage,
    currentPage * musicsPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  return (
    <>
      {isFetching ? (
        <div className="animate-pulse bg-white rounded-lg shadow-sm mb-5 p-4 space-y-3">
          <div className="h-4 w-1/2 bg-skeleton rounded" />
          <div className="h-3 w-1/3 bg-skeleton rounded" />
          <div className="h-10 w-full bg-skeleton rounded" />
        </div>
      ) : initialData?.music ? (
        <div className="mb-5">
          <WaveformPlayer data={initialData.music} />
        </div>
      ) : null}
      <h2 className="font-medium text-lg mb-2">Pilih Dari Daftar Musik</h2>

      <Input
        placeholder="Cari judul musik..."
        value={searchTerm}
        type="search"
        onChange={handleSearchChange}
        className="mb-4 max-w-md"
        isFetching={isFetching}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {isFetching ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg shadow-sm p-4 space-y-3 bg-muted/50"
            >
              <div className="h-4 w-1/2 bg-skeleton rounded" />
              <div className="h-3 w-1/3 bg-skeleton rounded" />
              <div className="h-10 w-full bg-skeleton rounded" />
            </div>
          ))
        ) : currentMusics.length > 0 ? (
          currentMusics.map((music) => (
            <div key={music.id}>
              <WaveformPlayer
                data={music}
                selectSong={music.id === initialData?.music?.id ? false : true}
                onSelectSong={onSelectSong}
                loading={selectMusicId === music.id}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Music strokeWidth={1.5} size={64} />
            <p className="text-sm font-medium">Musik tidak ditemukan</p>
            <p className="text-xs">Coba gunakan kata kunci lain.</p>
          </div>
        )}
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
    </>
  );
};

export default MusicForm;
