package com.mycompany.shop.springbootshop.repository;

import java.util.List;

import com.mycompany.shop.springbootshop.domain.Product;

public interface ProductRepositoryCustomMethods {
	List<Product> findByDate(int limit);
	List<Product> findByQuery(String columnName, boolean value, int limit);
	List<Product> findByRating(int limit);
	List<Product> findBySearchParameter(String searchParameter);
}
