import * as productRepository from './products.repository.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeProductPayload(payload) {
  return {
    name: payload.name?.trim(),
    description: payload.description?.trim() || null,
    price: Number(payload.price),
    stock: Number(payload.stock ?? 0),
    category: payload.category?.trim() || null,
    imageUrl: payload.imageUrl?.trim() || payload.image_url?.trim() || null,
    active: payload.active ?? true,
  };
}

function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.name !== undefined) {
    if (!payload.name || payload.name.trim().length < 3) {
      errors.push('O nome do produto deve ter pelo menos 3 caracteres');
    }
  }

  if (!partial || payload.price !== undefined) {
    const price = Number(payload.price);

    if (!Number.isFinite(price) || price < 0) {
      errors.push('O preco do produto deve ser um numero maior ou igual a zero');
    }
  }

  if (!partial || payload.stock !== undefined) {
    const stock = Number(payload.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      errors.push('O estoque do produto deve ser um numero inteiro maior ou igual a zero');
    }
  }

  if (errors.length > 0) {
    throw createHttpError(400, errors.join('. '));
  }
}

function validateId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw createHttpError(400, 'ID do produto invalido');
  }

  return numericId;
}

export async function listProducts(filters) {
  return productRepository.findAll(filters);
}

export async function getProductById(id) {
  const productId = validateId(id);
  const product = await productRepository.findById(productId);

  if (!product) {
    throw createHttpError(404, 'Produto nao encontrado');
  }

  return product;
}

export async function createProduct(payload) {
  validateProductPayload(payload);

  const product = normalizeProductPayload(payload);
  return productRepository.create(product);
}

export async function updateProduct(id, payload) {
  const productId = validateId(id);
  validateProductPayload(payload, { partial: true });

  const currentProduct = await productRepository.findById(productId);

  if (!currentProduct) {
    throw createHttpError(404, 'Produto nao encontrado');
  }

  const product = {
    name: payload.name?.trim() ?? currentProduct.name,
    description: payload.description?.trim() ?? currentProduct.description,
    price: payload.price !== undefined ? Number(payload.price) : Number(currentProduct.price),
    stock: payload.stock !== undefined ? Number(payload.stock) : currentProduct.stock,
    category: payload.category?.trim() ?? currentProduct.category,
    imageUrl:
      payload.imageUrl?.trim() ??
      payload.image_url?.trim() ??
      currentProduct.image_url,
    active: payload.active ?? currentProduct.active,
  };

  return productRepository.update(productId, product);
}

export async function deleteProduct(id) {
  const productId = validateId(id);
  const deletedProduct = await productRepository.remove(productId);

  if (!deletedProduct) {
    throw createHttpError(404, 'Produto nao encontrado');
  }
}
