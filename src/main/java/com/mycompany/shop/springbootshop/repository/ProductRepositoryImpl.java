package com.mycompany.shop.springbootshop.repository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import com.mycompany.shop.springbootshop.domain.Product;

@Repository
public class ProductRepositoryImpl implements ProductRepositoryCustomMethods {

	private final MongoTemplate mongoTemplate;

	@Autowired
	public ProductRepositoryImpl(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@Override
	public List<Product> findByDate(int limit) {
		Query query = new Query();
		query.with(Sort.by(Sort.Direction.DESC, "date")).limit(limit);
		return mongoTemplate.find(query, Product.class);
	}
	
	@Override
	public List<Product> findByQuery(String columnName, boolean value, int limit) {
		Query query = new Query(Criteria.where(columnName).is(value));
		return mongoTemplate.find(query.limit(limit), Product.class);
	}

	@Override
	public List<Product> findByRating(int limit) {
		Query query = new Query();
		query.with(Sort.by(Sort.Direction.DESC, "currentRating")).limit(limit);
		return mongoTemplate.find(query, Product.class);
	}

	@Override
	public List<Product> findBySearchParameter(String parameter) {
		Query query = new Query(Criteria.where("name").regex("^"+parameter));
		return mongoTemplate.find(query, Product.class);
	}

}
