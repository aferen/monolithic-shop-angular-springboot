package com.mycompany.shop.springbootshop.repository;

import java.util.List;

import com.mycompany.shop.springbootshop.domain.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findAllByUserId(String userId);
}
