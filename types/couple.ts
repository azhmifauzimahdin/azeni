export interface CoupleRequest {
  groomName: string;
  groomFather: string;
  groomMother: string;
  groomInstagram?: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
  brideInstagram?: string;
}

export interface Couple {
  id: string;
  invitationId: string;
  groomName: string;
  groomFather: string;
  groomMother: string;
  groomImage: string;
  groomInstagram: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
  brideImage: string;
  brideInstagram: string;
  createdAt: string;
  updatedAt: string;
}
