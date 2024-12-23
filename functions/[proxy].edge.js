import Personalize from '@contentstack/personalize-edge-sdk';
export default async function handler(request, context) {
  const parsedUrl = new URL(request.url);
  const pathname = parsedUrl.pathname;
  // exclude Next.js asset calls so that only page requests are processed
  if (['_next', 'favicon.ico'].some((path) => pathname.includes(path))) {
    return fetch(request);
  }
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
  const variantParam = Personalize.getVariantParam();
  if (variantParam) {
	parsedUrl.searchParams.set(Personalize.VARIANT_QUERY_PARAM, variantParam);
  }
  const modifiedRequest = new Request(parsedUrl.toString(), request);
  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);
  // add cookies to the response
  await Personalize.addStateToResponse(modifiedResponse);
  // ensure that the response is not cached on the browser
  modifiedResponse.headers.set('cache-control', 'no-store');
  return modifiedResponse;
}