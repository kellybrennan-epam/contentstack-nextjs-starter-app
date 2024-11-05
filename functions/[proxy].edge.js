import Personalize from '@contentstack/personalize-edge-sdk';
export default async function handler(request, context) {
  const parsedUrl = new URL(request.url);
  // reset the SDK to remove any existing context
  Personalize.reset();
  // set a custom edge API URL
  if (context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
    Personalize.setEdgeApiUrl(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
  }
  // Initialize the SDK and pass the request as well
  await Personalize.init(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID, {
    request,
  });
  return fetch(request);
}