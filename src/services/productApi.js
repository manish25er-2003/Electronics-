const configuredBaseUrl = import.meta.env.VITE_PRODUCT_API_BASE_URL?.trim();
const apiBaseUrl = configuredBaseUrl?.replace(/\/+$/, '') || '';

export const isProductApiConfigured = Boolean(apiBaseUrl);

async function request(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error('Product API is not configured.');
  }

  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const error = await response.json();
      message = error.message || error.error || message;
    } catch {
      // Keep the HTTP status message when the server does not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function unwrapProducts(response) {
  const products = Array.isArray(response) ? response : response?.products;
  if (!Array.isArray(products)) {
    throw new Error('The products API must return an array or an object with a products array.');
  }
  return products;
}

export async function fetchPublicProducts() {
  const response = await request('/products');
  return unwrapProducts(response).filter((product) => product.published !== false);
}

export async function fetchAdminProducts() {
  const response = await request('/admin/products');
  return unwrapProducts(response);
}

export async function verifyAdminSession() {
  const response = await request('/admin/session');
  if (response?.authenticated !== true) {
    throw new Error('Admin access is required. Sign in to your store admin account, then try again.');
  }
  return true;
}

export async function saveRemoteProduct(product, productId) {
  const path = productId ? `/products/${encodeURIComponent(productId)}` : '/products';
  return request(path, {
    method: productId ? 'PATCH' : 'POST',
    body: JSON.stringify(product),
  });
}

export async function deleteRemoteProduct(productId) {
  return request(`/products/${encodeURIComponent(productId)}`, { method: 'DELETE' });
}

export async function uploadRemoteProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await request('/admin/products/images', {
    method: 'POST',
    body: formData,
  });
  if (typeof response?.url !== 'string' || !response.url.startsWith('https://')) {
    throw new Error('The image upload API must return a secure https URL in its url field.');
  }
  return response.url;
}
