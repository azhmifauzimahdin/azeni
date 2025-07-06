export interface StoryRequest {
  title: string;
  date: Date;
  description: string;
  image: string;
}

export interface Story {
  id: string;
  invitationId: string;
  title: string;
  date: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
