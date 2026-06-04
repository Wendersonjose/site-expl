import * as productService from './products.service.js';

export async function listProducts(req, res, next) {
  try {
    const products = await productService.listProducts(req.query);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
