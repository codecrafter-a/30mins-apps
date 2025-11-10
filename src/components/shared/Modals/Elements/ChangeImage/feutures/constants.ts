export type IValues = {
  imgSrc: string;
  aspect: number;
  upLoadImage(file: any): Promise<void>;
};
