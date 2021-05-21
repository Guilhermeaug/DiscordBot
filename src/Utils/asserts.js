export const isNsfw = (message) => {
  return message.channel.nsfw;
};

export const isThereAnyImages = (post) => {
  if (!post.preview || !post.preview.images) return false;
  else return true;
};

export const isValidUrl = (imageUrl) => {
  if (imageUrl.includes("external")) return false;
  else return true;
};
