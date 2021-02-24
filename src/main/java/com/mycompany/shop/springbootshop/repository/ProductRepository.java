package com.mycompany.shop.springbootshop.repository;

import com.mycompany.shop.springbootshop.domain.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String>, ProductRepositoryCustomMethods {
}
