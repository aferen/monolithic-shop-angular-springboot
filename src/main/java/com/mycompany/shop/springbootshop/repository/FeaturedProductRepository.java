package com.mycompany.shop.springbootshop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.mycompany.shop.springbootshop.domain.FeaturedProduct;

@Repository
public interface FeaturedProductRepository extends MongoRepository<FeaturedProduct, String> {
}
