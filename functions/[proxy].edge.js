import Personalize from '@contentstack/personalize-edge-sdk';
export default async function handler(request, context) {
  const parsedUrl = new URL(request.url);
  // reset the SDK to remove any existing context
  Personalize.reset();
  if (context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
    Personalize.setEdgeApiUrl(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
  }
  await Personalize.init(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID, {
    request,
  });
  // get the variant parameter from the SDK
  const variantParam = Personalize.getVariantParam();
  // set the variant parameter as a query param in the URL
  parsedUrl.searchParams.set(Personalize.VARIANT_QUERY_PARAM, variantParam);
  // rewrite the request with the modified URL
  const modifiedRequest = new Request(parsedUrl.toString(), request);
  const response = await fetch(modifiedRequest);
  return response;
}