// Port: did an image file fail to load? The error event can fire before React
// attaches its handler, so a component also asks the image itself.

export type ImageProbe = {
  hasFailedToLoad(image: HTMLImageElement): boolean;
};

export const browserImageProbe: ImageProbe = {
  hasFailedToLoad: (image) => image.complete && image.naturalWidth === 0,
};
