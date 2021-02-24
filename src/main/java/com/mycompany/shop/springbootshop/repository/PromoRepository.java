package com.mycompany.shop.springbootshop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mycompany.shop.springbootshop.domain.Promo;

@Repository
public interface PromoRepository extends MongoRepository<Promo, String> {
}

